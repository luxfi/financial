import type { ReactNode } from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Card({
  title,
  subtitle,
  actions,
  className,
  children,
}: CardProps) {
  return (
    <section
      className={[
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5',
        className ?? '',
      ].join(' ')}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between mb-3">
          <div>
            {title ? (
              <h2 className="text-[1.4rem] font-semibold">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="text-[1.2rem] text-[var(--color-muted)] mt-0.5">
                {subtitle}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex gap-2">{actions}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
}
