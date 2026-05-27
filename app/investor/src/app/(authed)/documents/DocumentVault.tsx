'use client';

// DocumentVault renders the category tree on the left + filterable doc
// list on the right + per-row actions (view / download / share). The
// integrity verification happens here on download.

import { useMemo, useState } from 'react';
import { Card, DataTable, Notice, type Column } from '@/components/data';
import { Button, Select } from '@/components/forms';
import {
  document as documentClient,
  type DocumentCategory,
  type DocumentRow,
} from '@/lib/gateway/document';
import { verifySha256, IntegrityError } from '@/lib/worm';
import { fmtDate } from '@/lib/format';
import { ShareDialog } from './ShareDialog';

type FilterState = {
  category: DocumentCategory | 'all';
  search: string;
};

export interface DocumentVaultProps {
  initialRows: DocumentRow[];
  categories: Array<{
    id: DocumentCategory;
    label: string;
    description: string;
  }>;
}

export function DocumentVault({ initialRows, categories }: DocumentVaultProps) {
  const [filter, setFilter] = useState<FilterState>({
    category: 'all',
    search: '',
  });
  const [rowError, setRowError] = useState<string | null>(null);
  const [shareTarget, setShareTarget] = useState<DocumentRow | null>(null);

  // Per-doc-id activity message ("verifying", "verified", "mismatch", "downloading").
  const [activity, setActivity] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () => applyFilter(initialRows, filter),
    [initialRows, filter],
  );

  const counts = useMemo(() => {
    const c: Partial<Record<DocumentCategory, number>> = {};
    for (const r of initialRows) c[r.category] = (c[r.category] ?? 0) + 1;
    return c;
  }, [initialRows]);

  async function onView(row: DocumentRow) {
    await fetchAndVerify(row, /* openInTab */ true);
  }

  async function onDownload(row: DocumentRow) {
    await fetchAndVerify(row, /* openInTab */ false);
  }

  async function fetchAndVerify(row: DocumentRow, openInTab: boolean) {
    setRowError(null);
    setActivity((a) => ({ ...a, [row.id]: 'fetching…' }));
    try {
      const body = await documentClient.get(row.id);
      setActivity((a) => ({ ...a, [row.id]: 'verifying…' }));
      const bytes = base64ToBytes(body.bodyBase64);
      // The manifest hash on the listing row MUST equal the recomputed
      // hash. Independently check the gateway-reported hash too.
      await verifySha256(bytes, row.sha256);
      if (body.sha256 && body.sha256.toLowerCase() !== row.sha256.toLowerCase()) {
        throw new IntegrityError(row.sha256, body.sha256);
      }
      setActivity((a) => ({ ...a, [row.id]: 'verified' }));
      const blob = new Blob([bytes], { type: body.contentType || row.mimeType });
      const url = URL.createObjectURL(blob);
      if (openInTab) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        const a = global.document.createElement('a');
        a.href = url;
        a.download = body.filename || row.name;
        a.click();
      }
      // Free the object URL on the next tick — gives the browser time to
      // start the download / open the tab.
      setTimeout(() => URL.revokeObjectURL(url), 5_000);
    } catch (err) {
      const msg = err instanceof IntegrityError
        ? `Integrity check failed for ${row.name}: ${err.message}. The WORM audit log has been notified.`
        : (err as Error).message;
      setRowError(msg);
      setActivity((a) => ({ ...a, [row.id]: 'failed' }));
    }
  }

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: '260px 1fr' }}>
      <aside data-testid="document-categories" className="space-y-1">
        <CategoryButton
          label="All documents"
          count={initialRows.length}
          active={filter.category === 'all'}
          onClick={() => setFilter((f) => ({ ...f, category: 'all' }))}
        />
        {categories.map((c) => (
          <CategoryButton
            key={c.id}
            label={c.label}
            count={counts[c.id] ?? 0}
            description={c.description}
            active={filter.category === c.id}
            onClick={() => setFilter((f) => ({ ...f, category: c.id }))}
          />
        ))}
      </aside>

      <div className="space-y-4">
        <Card>
          <div className="flex gap-3 items-center">
            <input
              type="search"
              placeholder="Search documents by name, issuer, type…"
              value={filter.search}
              onChange={(e) =>
                setFilter((f) => ({ ...f, search: e.target.value }))
              }
              className="h-10 flex-1 rounded-lg px-3 bg-[var(--color-background)] border border-[var(--color-border)] text-[1.3rem]"
              aria-label="Search documents"
            />
            <Select
              name="category-select"
              label="Category"
              value={filter.category}
              onChange={(e) =>
                setFilter((f) => ({
                  ...f,
                  category: e.target.value as DocumentCategory | 'all',
                }))
              }
              options={[
                { value: 'all', label: 'All' },
                ...categories.map((c) => ({ value: c.id, label: c.label })),
              ]}
            />
          </div>
        </Card>

        {rowError ? <Notice tone="error">{rowError}</Notice> : null}

        <Card>
          <DataTable<DocumentRow>
            ariaLabel="Investor documents"
            rowKey={(r) => r.id}
            empty="No documents match the current filter."
            rows={filtered}
            columns={DOCUMENT_COLUMNS(activity, onView, onDownload, (r) =>
              setShareTarget(r),
            )}
          />
        </Card>
      </div>

      {shareTarget ? (
        <ShareDialog
          row={shareTarget}
          onClose={() => setShareTarget(null)}
        />
      ) : null}
    </div>
  );
}

function CategoryButton({
  label,
  count,
  description,
  active,
  onClick,
}: {
  label: string;
  count: number;
  description?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full text-left rounded-lg px-3 py-2 border transition-colors',
        active
          ? 'bg-[var(--color-surface)] border-[var(--color-border-hover)]'
          : 'bg-transparent border-transparent hover:bg-[var(--color-surface)] hover:border-[var(--color-border)]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="text-[1.3rem] font-medium">{label}</span>
        <span className="text-[1.1rem] tabular-nums text-[var(--color-muted)]">
          {count}
        </span>
      </div>
      {description ? (
        <div className="text-[1.1rem] text-[var(--color-muted)] mt-0.5">
          {description}
        </div>
      ) : null}
    </button>
  );
}

function DOCUMENT_COLUMNS(
  activity: Record<string, string>,
  onView: (r: DocumentRow) => void,
  onDownload: (r: DocumentRow) => void,
  onShare: (r: DocumentRow) => void,
): Column<DocumentRow>[] {
  return [
    {
      key: 'name',
      header: 'Document',
      render: (r) => (
        <div>
          <div className="font-medium">{r.name}</div>
          <div className="text-[1.1rem] text-[var(--color-muted)]">
            {r.docType}
            {r.offeringName ? ` · ${r.offeringName}` : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'issuedBy',
      header: 'Issued by',
      render: (r) => r.issuedBy,
    },
    {
      key: 'issuedDate',
      header: 'Issued',
      render: (r) => fmtDate(r.issuedDate),
    },
    {
      key: 'size',
      header: 'Size',
      align: 'right',
      render: (r) => fmtBytes(r.sizeBytes),
    },
    {
      key: 'sha',
      header: 'SHA-256',
      render: (r) => (
        <code
          title={r.sha256}
          className="font-mono text-[1.05rem] text-[var(--color-muted)]"
        >
          {r.sha256.slice(0, 10)}…
        </code>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (r) => (
        <div className="flex gap-2 justify-end items-center">
          {activity[r.id] ? (
            <span
              data-testid={`activity-${r.id}`}
              className="text-[1.05rem] text-[var(--color-muted)] mr-2"
            >
              {activity[r.id]}
            </span>
          ) : null}
          <Button variant="ghost" onClick={() => onView(r)}>
            View
          </Button>
          <Button variant="ghost" onClick={() => onDownload(r)}>
            Download
          </Button>
          <Button variant="primary" onClick={() => onShare(r)}>
            Share with advisor
          </Button>
        </div>
      ),
    },
  ];
}

function applyFilter(rows: DocumentRow[], f: FilterState): DocumentRow[] {
  const needle = f.search.trim().toLowerCase();
  return rows.filter((r) => {
    if (f.category !== 'all' && r.category !== f.category) return false;
    if (!needle) return true;
    return (
      r.name.toLowerCase().includes(needle) ||
      r.docType.toLowerCase().includes(needle) ||
      r.issuedBy.toLowerCase().includes(needle) ||
      (r.offeringName ?? '').toLowerCase().includes(needle)
    );
  });
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function base64ToBytes(b64: string): Uint8Array {
  // atob is universally available in the browser; in tests happy-dom
  // exposes it too. Falls back to Buffer in node-only paths.
  const bin =
    typeof atob === 'function'
      ? atob(b64)
      : Buffer.from(b64, 'base64').toString('binary');
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
