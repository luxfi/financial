import { DataTable, type Column, Card } from '@/components/data';
import type { PendingSettlement } from '@/lib/gateway';
import { fmtCurrency, fmtDate, fmtNumber } from '@/lib/format';

const columns: Column<PendingSettlement>[] = [
  {
    key: 'security',
    header: 'Security',
    align: 'left',
    render: (s) => (
      <div>
        <div className="font-medium">{s.securityName}</div>
        <div className="text-[1.1rem] text-[var(--color-muted)]">{s.securityID}</div>
      </div>
    ),
  },
  {
    key: 'side',
    header: 'Side',
    align: 'left',
    render: (s) => (
      <span
        className={
          s.side === 'buy'
            ? 'text-[var(--color-success)]'
            : 'text-[var(--color-danger)]'
        }
      >
        {s.side.toUpperCase()}
      </span>
    ),
  },
  {
    key: 'qty',
    header: 'Qty',
    align: 'right',
    render: (s) => fmtNumber(s.quantity, 4),
  },
  {
    key: 'price',
    header: 'Price',
    align: 'right',
    render: (s) => fmtCurrency(s.price, s.currency),
  },
  {
    key: 'gross',
    header: 'Gross',
    align: 'right',
    render: (s) => fmtCurrency(s.grossAmount, s.currency),
  },
  {
    key: 'bucket',
    header: 'Bucket',
    align: 'center',
    render: (s) => (
      <span className="rounded-md px-2 py-0.5 bg-[var(--color-surface-hover)] text-[1.2rem]">
        {s.bucket}
      </span>
    ),
  },
  {
    key: 'expected',
    header: 'Expected',
    align: 'right',
    render: (s) => fmtDate(s.expectedSettlementDate),
  },
  {
    key: 'status',
    header: 'Status',
    align: 'left',
    render: (s) => (
      <span className="text-[var(--color-secondary)]">{s.status.replace(/_/g, ' ')}</span>
    ),
  },
];

export function PendingSettlementsCard({
  settlements,
}: {
  settlements: PendingSettlement[];
}) {
  return (
    <Card title="Pending settlement" subtitle="Trades in T+0 / T+1 / T+2">
      <DataTable
        ariaLabel="Pending settlements"
        columns={columns}
        rows={settlements}
        rowKey={(s) => s.tradeID}
        empty="No pending settlements."
      />
    </Card>
  );
}
