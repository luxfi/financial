// Per-offering detail block. Renders the order-book + trade history +
// order-entry side-by-side under one card with the symbol header.

import { Card } from '@/components/data';
import type {
  MarketOffering,
  OrderBookSnapshot,
  TradePrint,
} from '@/lib/gateway';
import { fmtCurrency, fmtNumber } from '@/lib/format';
import { OrderBookView } from './OrderBookView';
import { OrderEntryPanel } from './OrderEntryPanel';
import { TradeHistoryView } from './TradeHistoryView';

export function OfferingDetail({
  offering,
  orderBook,
  trades,
}: {
  offering: MarketOffering;
  orderBook: OrderBookSnapshot;
  trades: TradePrint[];
}) {
  return (
    <>
      <Card
        title={`${offering.name} · ${offering.symbol}`}
        subtitle={`${offering.issuer} · ${offering.assetClass}`}
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
          <Stat
            label="Best bid"
            value={offering.bestBid ? fmtCurrency(offering.bestBid, offering.currency) : '—'}
          />
          <Stat
            label="Best ask"
            value={offering.bestAsk ? fmtCurrency(offering.bestAsk, offering.currency) : '—'}
          />
          <Stat
            label="Last trade"
            value={
              offering.lastTradePrice
                ? fmtCurrency(offering.lastTradePrice, offering.currency)
                : '—'
            }
          />
          <Stat
            label="24h volume"
            value={fmtCurrency(offering.volume24h, offering.currency, {
              maximumFractionDigits: 0,
            })}
          />
        </div>
      </Card>

      <Card title="Order book" subtitle={`As of ${orderBook.asOf}`}>
        <OrderBookView snapshot={orderBook} currency={offering.currency} />
      </Card>

      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <Card title="Trade history">
          <TradeHistoryView trades={trades} currency={offering.currency} />
        </Card>
        <Card title="Place order">
          <OrderEntryPanel offering={offering} />
        </Card>
      </div>

      <SpreadHint offering={offering} />
    </>
  );
}

function SpreadHint({ offering }: { offering: MarketOffering }) {
  if (!offering.bestBid || !offering.bestAsk) return null;
  const bid = Number(offering.bestBid);
  const ask = Number(offering.bestAsk);
  if (!Number.isFinite(bid) || !Number.isFinite(ask) || bid <= 0) return null;
  const spread = ask - bid;
  const spreadBps = (spread / bid) * 10_000;
  return (
    <div className="text-[1.2rem] text-[var(--color-muted)]">
      Spread: {fmtCurrency(spread.toFixed(4), offering.currency)} (
      {fmtNumber(spreadBps, 1)} bps)
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[1.1rem] uppercase tracking-[0.06em] text-[var(--color-muted)]">
        {label}
      </div>
      <div className="text-[1.6rem] font-semibold tabular-nums mt-1">
        {value}
      </div>
    </div>
  );
}
