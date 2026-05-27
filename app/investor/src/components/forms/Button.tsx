import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
}

const VARIANT = {
  primary: 'bg-[var(--color-accent)] text-[var(--color-accent-fg)] border-transparent',
  ghost: 'bg-transparent text-[var(--color-foreground)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
  danger: 'bg-[var(--color-danger)] text-white border-transparent',
} as const;

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={[
        'h-10 rounded-lg px-4 text-[1.3rem] font-semibold border transition-opacity',
        VARIANT[variant],
        'hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed',
        className ?? '',
      ].join(' ')}
    />
  );
}
