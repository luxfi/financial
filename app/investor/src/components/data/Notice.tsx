import type { ReactNode } from 'react';

export type NoticeTone = 'info' | 'success' | 'warn' | 'error';

const TONE: Record<NoticeTone, string> = {
  info: 'border-[var(--color-border)] text-[var(--color-secondary)]',
  success: 'border-[var(--color-success)] text-[var(--color-success)]',
  warn: 'border-[var(--color-warning)] text-[var(--color-warning)]',
  error: 'border-[var(--color-danger)] text-[var(--color-danger)]',
};

export function Notice({
  tone = 'info',
  children,
}: {
  tone?: NoticeTone;
  children: ReactNode;
}) {
  return (
    <div
      role={tone === 'error' || tone === 'warn' ? 'alert' : undefined}
      className={[
        'bg-[var(--color-surface)] rounded-lg px-4 py-3 text-[1.3rem] border',
        TONE[tone],
      ].join(' ')}
    >
      {children}
    </div>
  );
}
