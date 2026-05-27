import type { ReactNode } from 'react';

export interface StatProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  valueClassName?: string;
}

export function Stat({ label, value, hint, valueClassName }: StatProps) {
  return (
    <div>
      <div className="text-[1.1rem] uppercase tracking-[0.06em] text-[var(--color-muted)]">
        {label}
      </div>
      <div
        className={[
          'text-[2.8rem] font-bold mt-1 tracking-[-0.02em] tabular-nums',
          valueClassName ?? '',
        ].join(' ')}
      >
        {value}
      </div>
      {hint ? (
        <div className="text-[1.2rem] text-[var(--color-secondary)] mt-1">
          {hint}
        </div>
      ) : null}
    </div>
  );
}
