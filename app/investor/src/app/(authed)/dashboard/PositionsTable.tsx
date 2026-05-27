import { DataTable, type Column } from '@/components/data';
import type { Position } from '@/lib/gateway';
import { fmtCurrency, fmtNumber, signClass } from '@/lib/format';

const columns: Column<Position>[] = [
  {
    key: 'offering',
    header: 'Offering',
    align: 'left',
    render: (p) => (
      <div>
        <div className="font-medium">{p.offeringName}</div>
        <div className="text-[1.1rem] text-[var(--color-muted)]">{p.securityClass}</div>
      </div>
    ),
  },
  {
    key: 'qty',
    header: 'Quantity',
    align: 'right',
    render: (p) => fmtNumber(p.quantity, 4),
  },
  {
    key: 'cost',
    header: 'Cost basis',
    align: 'right',
    render: (p) => fmtCurrency(p.costBasis, p.currency),
  },
  {
    key: 'nav',
    header: 'NAV',
    align: 'right',
    render: (p) => fmtCurrency(p.nav, p.currency),
  },
  {
    key: 'pnl',
    header: 'Unrealized P&L',
    align: 'right',
    render: (p) => (
      <span className={signClass(p.unrealizedPnL)}>
        {fmtCurrency(p.unrealizedPnL, p.currency, { signDisplay: 'exceptZero' })}
      </span>
    ),
  },
  {
    key: 'lockup',
    header: 'Lockup',
    align: 'right',
    render: (p) =>
      p.lockupRemainingDays > 0
        ? `${fmtNumber(p.lockupRemainingDays)}d`
        : '—',
  },
  {
    key: 'restrictions',
    header: 'Restrictions',
    align: 'left',
    render: (p) => (
      <span className="text-[var(--color-secondary)]">
        {p.restrictionsLabel || '—'}
      </span>
    ),
  },
];

export function PositionsTable({ positions }: { positions: Position[] }) {
  return (
    <DataTable
      ariaLabel="Positions"
      columns={columns}
      rows={positions}
      rowKey={(p) => p.id}
      empty="You have no open positions."
    />
  );
}
