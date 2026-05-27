import { Card, Stat } from '@/components/data';
import type { PortfolioSummary as Summary } from '@/lib/gateway';
import { fmtCurrency, signClass } from '@/lib/format';

export function PortfolioSummaryCard({ summary }: { summary: Summary }) {
  return (
    <Card title="Portfolio NAV" subtitle={`As of ${summary.asOf}`}>
      <Stat
        label="Total NAV"
        value={fmtCurrency(summary.totalNAV, summary.currency)}
        hint={`${summary.positionCount} positions · cost basis ${fmtCurrency(summary.totalCostBasis, summary.currency)}`}
      />
      <dl className="grid grid-cols-3 gap-4 mt-6 text-[1.3rem]">
        <Delta label="24h" value={summary.deltas.h24} currency={summary.currency} />
        <Delta label="7d" value={summary.deltas.d7} currency={summary.currency} />
        <Delta label="30d" value={summary.deltas.d30} currency={summary.currency} />
      </dl>
    </Card>
  );
}

function Delta({
  label,
  value,
  currency,
}: {
  label: string;
  value: string;
  currency: string;
}) {
  return (
    <div>
      <dt className="text-[1.1rem] uppercase tracking-[0.06em] text-[var(--color-muted)]">
        {label}
      </dt>
      <dd className={['mt-1 font-semibold tabular-nums', signClass(value)].join(' ')}>
        {fmtCurrency(value, currency, { signDisplay: 'exceptZero' })}
      </dd>
    </div>
  );
}
