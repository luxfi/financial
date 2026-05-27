import type { ReactNode } from 'react';

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <h1 className="text-[2.4rem] font-bold tracking-[-0.02em]">{title}</h1>
        {subtitle ? (
          <p className="text-[1.3rem] text-[var(--color-secondary)] mt-1">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </div>
  );
}
