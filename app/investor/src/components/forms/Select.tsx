import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  label?: string;
}

export function Select({ options, label, className, id, ...rest }: SelectProps) {
  const inputId = id ?? rest.name;
  return (
    <label htmlFor={inputId} className="flex items-center gap-2 text-[1.2rem] text-[var(--color-secondary)]">
      {label ? <span>{label}</span> : null}
      <select
        id={inputId}
        {...rest}
        className={[
          'h-9 rounded-lg px-3 bg-[var(--color-background)] border border-[var(--color-border)] text-[1.3rem] text-[var(--color-foreground)]',
          className ?? '',
        ].join(' ')}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
