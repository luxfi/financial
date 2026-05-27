// Secondary market — Stage 10.5.
//
// Server component. Lists every secondary-tradable offering the investor's
// accreditation permits (gateway-side filter on accreditation tier).
// Drill-down: ?id=<offeringID> shows the order-book + trade history +
// order-entry panel + my-orders for that offering. The order-entry POST
// triggers the G-37 pre-trade compliance gate before routing.
//
// Source-of-design: Lux-Prior-IP
// Source-ref: broker/pkg/pretrade (gate.go, router_middleware.go,
//   audit_bridge.go) + broker/pkg/router (router.go, twap.go) +
//   broker/pkg/provider/northcapital (NCPS-backed secondary trades).

import Link from 'next/link';
import { Card, DataTable, Notice, PageHeader } from '@/components/data';
import type { Column } from '@/components/data';
import {
  gateway,
  type MarketOffering,
  type MarketOrder,
  type OrderBookSnapshot,
  type TradePrint,
} from '@/lib/gateway';
import { fmtCurrency, fmtDateTime, fmtNumber } from '@/lib/format';
import { OfferingDetail } from './OfferingDetail';

export const dynamic = 'force-dynamic';

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function MarketPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const selectedID = first(sp.id);

  let offerings: MarketOffering[] = [];
  let error: string | null = null;
  try {
    offerings = await gateway.market.listOfferings();
  } catch (e) {
    error = (e as Error).message;
  }

  const selected = selectedID
    ? offerings.find((o) => o.id === selectedID) ?? null
    : null;

  let orderBook: OrderBookSnapshot | null = null;
  let trades: TradePrint[] = [];
  if (selected) {
    orderBook = await gateway.market.orderBook(selected.id).catch(() => null);
    trades = await gateway.market.tradeHistory(selected.id).catch(() => []);
  }
  const orders: MarketOrder[] = await gateway.market.listOrders().catch(() => []);

  return (
    <>
      <PageHeader
        title="Secondary Market"
        subtitle="Place limit bids and asks on secondary-tradable offerings. Every order is screened by the pre-trade compliance gate (G-37) before it touches the order book."
      />

      {error ? (
        <div className="mb-4">
          <Notice tone="error">Failed to load offerings: {error}</Notice>
        </div>
      ) : null}

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <Card title="Browse" subtitle={`${offerings.length} offerings`}>
          <OfferingsList offerings={offerings} selectedID={selectedID} />
        </Card>

        <div className="flex flex-col gap-4">
          {selected && orderBook ? (
            <OfferingDetail
              offering={selected}
              orderBook={orderBook}
              trades={trades}
            />
          ) : (
            <Card>
              <p className="text-[var(--color-secondary)]">
                Select an offering on the left to see the order book, trade
                history, and order-entry panel.
              </p>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Card title="My orders" subtitle={`${orders.length} on file`}>
          <MyOrdersTable rows={orders} />
        </Card>
      </div>
    </>
  );
}

function OfferingsList({
  offerings,
  selectedID,
}: {
  offerings: MarketOffering[];
  selectedID: string | undefined;
}) {
  if (offerings.length === 0) {
    return (
      <p className="text-[var(--color-muted)] text-[1.3rem]">
        No secondary offerings available to your accreditation tier.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-1">
      {offerings.map((o) => {
        const active = o.id === selectedID;
        return (
          <li key={o.id}>
            <Link
              href={`/market?id=${encodeURIComponent(o.id)}`}
              className={[
                'block px-3 py-2 rounded-lg text-[1.3rem]',
                active
                  ? 'bg-[var(--color-surface-hover)] text-[var(--color-foreground)]'
                  : 'text-[var(--color-secondary)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-hover)]',
              ].join(' ')}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium">{o.symbol}</span>
                <span className="text-[1.1rem] text-[var(--color-muted)]">
                  {fmtCurrency(o.volume24h, o.currency, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="text-[1.1rem] text-[var(--color-muted)] truncate">
                {o.name}
              </div>
              <div className="flex justify-between text-[1.2rem] mt-1 tabular-nums">
                <span>
                  Bid {o.bestBid ? fmtCurrency(o.bestBid, o.currency) : '—'}
                </span>
                <span>
                  Ask {o.bestAsk ? fmtCurrency(o.bestAsk, o.currency) : '—'}
                </span>
              </div>
              {!o.open ? (
                <div className="text-[1.1rem] text-[var(--color-warning)] mt-1">
                  Session closed
                </div>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MyOrdersTable({ rows }: { rows: MarketOrder[] }) {
  const cols: Column<MarketOrder>[] = [
    { key: 'sym', header: 'Symbol', render: (r) => r.symbol },
    { key: 'side', header: 'Side', render: (r) => r.side.toUpperCase() },
    {
      key: 'qty',
      header: 'Qty / Filled',
      align: 'right',
      render: (r) => `${fmtNumber(r.filledQuantity)} / ${fmtNumber(r.quantity)}`,
    },
    {
      key: 'price',
      header: 'Limit',
      align: 'right',
      render: (r) => fmtCurrency(r.price, 'USD'),
    },
    { key: 'tif', header: 'TIF', render: (r) => r.timeInForce.toUpperCase() },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span
          className={
            r.status === 'gate_denied' || r.status === 'rejected'
              ? 'text-[var(--color-danger)]'
              : r.status === 'gate_escalated'
                ? 'text-[var(--color-warning)]'
                : r.status === 'filled'
                  ? 'text-[var(--color-success)]'
                  : 'text-[var(--color-secondary)]'
          }
        >
          {r.status.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'submitted',
      header: 'Submitted',
      render: (r) => fmtDateTime(r.submittedAt),
    },
  ];
  return (
    <DataTable
      ariaLabel="My orders"
      rows={rows}
      rowKey={(r) => r.id}
      columns={cols}
      empty="You have no orders on file."
    />
  );
}
