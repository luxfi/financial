// Top-of-book + depth table. Pure presentation — the data comes from the
// server fetch in the parent page.

import { DataTable } from '@/components/data';
import type { Column } from '@/components/data';
import type { OrderBookLevel, OrderBookSnapshot } from '@/lib/gateway';
import { fmtCurrency, fmtNumber } from '@/lib/format';

export function OrderBookView({
  snapshot,
  currency,
}: {
  snapshot: OrderBookSnapshot;
  currency: string;
}) {
  const bidCols: Column<OrderBookLevel>[] = [
    {
      key: 'price',
      header: 'Bid',
      align: 'right',
      render: (l) => (
        <span className="text-[var(--color-success)] tabular-nums">
          {fmtCurrency(l.price, currency)}
        </span>
      ),
    },
    {
      key: 'qty',
      header: 'Qty',
      align: 'right',
      render: (l) => fmtNumber(l.quantity),
    },
    {
      key: 'orders',
      header: 'Orders',
      align: 'right',
      render: (l) => l.orders,
    },
  ];

  const askCols: Column<OrderBookLevel>[] = [
    {
      key: 'price',
      header: 'Ask',
      align: 'right',
      render: (l) => (
        <span className="text-[var(--color-danger)] tabular-nums">
          {fmtCurrency(l.price, currency)}
        </span>
      ),
    },
    {
      key: 'qty',
      header: 'Qty',
      align: 'right',
      render: (l) => fmtNumber(l.quantity),
    },
    {
      key: 'orders',
      header: 'Orders',
      align: 'right',
      render: (l) => l.orders,
    },
  ];

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
      <div>
        <DataTable
          ariaLabel="Bids"
          columns={bidCols}
          rows={snapshot.bids}
          rowKey={(l) => `bid-${l.price}`}
          empty="No bids."
        />
      </div>
      <div>
        <DataTable
          ariaLabel="Asks"
          columns={askCols}
          rows={snapshot.asks}
          rowKey={(l) => `ask-${l.price}`}
          empty="No asks."
        />
      </div>
    </div>
  );
}
