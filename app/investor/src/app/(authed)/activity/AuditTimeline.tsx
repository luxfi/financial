import type { AuditEntry } from '@/lib/gateway';
import { fmtDateTime } from '@/lib/format';

const CATEGORY_COLOR: Record<string, string> = {
  auth: 'text-[var(--color-info)]',
  document: 'text-[var(--color-secondary)]',
  trade: 'text-[var(--color-success)]',
  withdrawal: 'text-[var(--color-warning)]',
  profile: 'text-[var(--color-foreground)]',
  beneficiary: 'text-[var(--color-foreground)]',
  kyc: 'text-[var(--color-info)]',
  comms: 'text-[var(--color-secondary)]',
};

const OUTCOME_COLOR: Record<string, string> = {
  success: 'text-[var(--color-success)]',
  failure: 'text-[var(--color-danger)]',
  denied: 'text-[var(--color-danger)]',
  pending: 'text-[var(--color-warning)]',
};

export function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-[var(--color-muted)] text-[1.3rem] py-6">
        No matching activity in the selected range.
      </div>
    );
  }
  return (
    <ol className="relative" data-testid="audit-timeline">
      {entries.map((e) => (
        <li
          key={e.id}
          className="grid items-start gap-4 py-3 border-b border-[var(--color-border)]"
          style={{ gridTemplateColumns: '180px 1fr auto' }}
        >
          <time className="text-[1.2rem] text-[var(--color-muted)] tabular-nums">
            {fmtDateTime(e.ts)}
          </time>
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className={[
                  'text-[1.1rem] uppercase tracking-[0.06em] font-semibold',
                  CATEGORY_COLOR[e.category] ?? '',
                ].join(' ')}
              >
                {e.category}
              </span>
              <span className="font-medium">{e.action}</span>
              {e.target ? (
                <span className="text-[1.2rem] text-[var(--color-muted)]">
                  → {e.target}
                </span>
              ) : null}
            </div>
            {e.description ? (
              <div className="text-[1.3rem] text-[var(--color-secondary)] mt-0.5">
                {e.description}
              </div>
            ) : null}
            <div className="text-[1.1rem] text-[var(--color-muted)] mt-1">
              IP {e.ip || '—'} · UA {(e.userAgent || '—').slice(0, 72)}
            </div>
            {e.err ? (
              <div className="text-[1.2rem] text-[var(--color-danger)] mt-1">
                {e.err}
              </div>
            ) : null}
          </div>
          <span
            className={[
              'text-[1.1rem] uppercase tracking-[0.06em] font-semibold',
              OUTCOME_COLOR[e.outcome] ?? '',
            ].join(' ')}
          >
            {e.outcome}
          </span>
        </li>
      ))}
    </ol>
  );
}
