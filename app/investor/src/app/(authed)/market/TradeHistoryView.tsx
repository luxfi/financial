// Trade-history view. Counterparty references are anonymised by the
// server (e.g. "counterparty_a7c"); the browser never sees the
// counterparty identity.

import { DataTable } from '@/components/data';
import type { Column } from '@/components/data';
import type { TradePrint } from '@/lib/gateway';
import { fmtCurrency, fmtDateTime, fmtNumber } from '@/lib/format';

export function TradeHistoryView({
  trades,
  currency,
}: {
  trades: TradePrint[];
  currency: string;
}) {
  const cols: Column<TradePrint>[] = [
    {
      key: 'when',
      header: 'Time',
      render: (t) => fmtDateTime(t.executedAt),
    },
    {
      key: 'side',
      header: 'Side',
      render: (t) => (
        <span
          className={
            t.side === 'bid'
              ? 'text-[var(--color-success)]'
              : 'text-[var(--color-danger)]'
          }
        >
          {t.side === 'bid' ? 'BUY' : 'SELL'}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      render: (t) => fmtCurrency(t.price, currency),
    },
    {
      key: 'qty',
      header: 'Qty',
      align: 'right',
      render: (t) => fmtNumber(t.quantity),
    },
    {
      key: 'cp',
      header: 'Counterparty',
      render: (t) => (
        <span className="font-mono text-[1.2rem] text-[var(--color-muted)]">
          {t.counterpartyRef}
        </span>
      ),
    },
  ];
  return (
    <DataTable
      ariaLabel="Trade history"
      columns={cols}
      rows={trades}
      rowKey={(t) => t.id}
      empty="No trades yet."
    />
  );
}
