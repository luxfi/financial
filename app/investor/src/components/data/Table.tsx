import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  render: (row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  ariaLabel?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  ariaLabel,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full border-collapse text-[1.3rem]"
        aria-label={ariaLabel}
      >
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={[
                  'px-3 py-2 text-[1.1rem] uppercase tracking-[0.06em] font-medium text-[var(--color-muted)] border-b border-[var(--color-border)]',
                  c.align === 'right'
                    ? 'text-right'
                    : c.align === 'center'
                    ? 'text-center'
                    : 'text-left',
                ].join(' ')}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-6 text-center text-[var(--color-muted)]"
              >
                {empty ?? 'No rows.'}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="hover:bg-[var(--color-surface-hover)]"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={[
                      'px-3 py-2 border-b border-[var(--color-border)] tabular-nums',
                      c.align === 'right'
                        ? 'text-right'
                        : c.align === 'center'
                        ? 'text-center'
                        : 'text-left',
                      c.className ?? '',
                    ].join(' ')}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
