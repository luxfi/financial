'use client';

// TaxView — per-year folder of 1099s + K-1 with cost-basis report toggle.

import { useEffect, useState } from 'react';
import { Card, DataTable, Notice, type Column } from '@/components/data';
import { Button } from '@/components/forms';
import {
  costBasisToCsv8949,
  tax,
  TAX_FORM_LABEL,
  type CostBasisLine,
  type CostBasisMethod,
  type CostBasisReport,
  type TaxFormRow,
  type TaxYearFolder,
} from '@/lib/gateway/tax';
import { verifySha256, IntegrityError } from '@/lib/worm';
import { fmtCurrency, fmtDate, signClass } from '@/lib/format';
import { SendToCpaDialog } from './SendToCpaDialog';

export interface TaxViewProps {
  years: number[];
  initialYear: number;
}

export function TaxView({ years, initialYear }: TaxViewProps) {
  const [year, setYear] = useState<number>(initialYear);
  const [folder, setFolder] = useState<TaxYearFolder | null>(null);
  const [method, setMethod] = useState<CostBasisMethod>('fifo');
  const [report, setReport] = useState<CostBasisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activity, setActivity] = useState<Record<string, string>>({});
  const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());
  const [sendOpen, setSendOpen] = useState(false);

  // Fetch the year folder whenever the year changes.
  useEffect(() => {
    let cancelled = false;
    setError(null);
    setFolder(null);
    tax
      .folder(year)
      .then((f) => !cancelled && setFolder(f))
      .catch((e) => !cancelled && setError((e as Error).message));
    return () => {
      cancelled = true;
    };
  }, [year]);

  // Fetch the cost-basis report whenever year or method changes.
  useEffect(() => {
    let cancelled = false;
    setReport(null);
    tax
      .costBasis(year, method)
      .then((r) => !cancelled && setReport(r))
      .catch((e) => !cancelled && setError((e as Error).message));
    return () => {
      cancelled = true;
    };
  }, [year, method]);

  async function onView(row: TaxFormRow) {
    await fetchForm(row, /* openInTab */ true);
  }
  async function onDownload(row: TaxFormRow) {
    await fetchForm(row, /* openInTab */ false);
  }

  async function fetchForm(row: TaxFormRow, openInTab: boolean) {
    setError(null);
    setActivity((a) => ({ ...a, [row.id]: 'fetching…' }));
    try {
      const body = await tax.formBody(row.id);
      setActivity((a) => ({ ...a, [row.id]: 'verifying…' }));
      const bytes = base64ToBytes(body.bodyBase64);
      await verifySha256(bytes, row.sha256);
      if (body.sha256 && body.sha256.toLowerCase() !== row.sha256.toLowerCase()) {
        throw new IntegrityError(row.sha256, body.sha256);
      }
      setActivity((a) => ({ ...a, [row.id]: 'verified' }));
      const blob = new Blob([bytes], { type: body.contentType || 'application/pdf' });
      const url = URL.createObjectURL(blob);
      if (openInTab) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        const a = global.document.createElement('a');
        a.href = url;
        a.download = body.filename || `${row.formType}-${row.taxYear}.pdf`;
        a.click();
      }
      setTimeout(() => URL.revokeObjectURL(url), 5_000);
    } catch (err) {
      const msg = err instanceof IntegrityError
        ? `Integrity check failed for ${row.formType}: ${err.message}.`
        : (err as Error).message;
      setError(msg);
      setActivity((a) => ({ ...a, [row.id]: 'failed' }));
    }
  }

  async function onExportCsv() {
    if (!report) return;
    try {
      // Prefer the server-side serializer; fall back to client serialiser
      // so the export still works under air-gapped / offline conditions.
      let csv: string;
      try {
        csv = await tax.costBasisCsv(year, method);
      } catch {
        csv = costBasisToCsv8949(report);
      }
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = global.document.createElement('a');
      a.href = url;
      a.download = `cost-basis-${year}-${method}-8949.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5_000);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function toggleSelected(id: string) {
    setSelectedForms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Tax year">
            {(years.length > 0 ? years : [year]).map((y) => (
              <button
                type="button"
                key={y}
                role="tab"
                aria-selected={year === y}
                onClick={() => setYear(y)}
                className={[
                  'rounded-lg px-4 py-2 border text-[1.3rem] font-medium',
                  year === y
                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-fg)] border-transparent'
                    : 'bg-transparent text-[var(--color-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface)]',
                ].join(' ')}
              >
                {y}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[1.2rem] text-[var(--color-muted)]">
              {selectedForms.size > 0
                ? `${selectedForms.size} selected`
                : 'Select forms to send to CPA'}
            </span>
            <Button
              variant="primary"
              disabled={selectedForms.size === 0}
              onClick={() => setSendOpen(true)}
            >
              Send to my CPA
            </Button>
          </div>
        </div>
      </Card>

      {error ? <Notice tone="error">{error}</Notice> : null}

      <Card
        title={`${year} forms`}
        subtitle={
          folder
            ? `${folder.formCount} forms · ordinary income ${fmtCurrency(folder.totalOrdinaryIncome, folder.currency)} · capital gain ${fmtCurrency(folder.totalCapitalGain, folder.currency)}`
            : 'Loading…'
        }
      >
        <DataTable<TaxFormRow>
          ariaLabel={`${year} tax forms`}
          rowKey={(r) => r.id}
          empty="No forms generated for this year yet."
          rows={folder?.forms ?? []}
          columns={TAX_COLUMNS(
            selectedForms,
            toggleSelected,
            activity,
            onView,
            onDownload,
          )}
        />
      </Card>

      <Card
        title="Cost-basis report"
        subtitle={
          report
            ? `${method.toUpperCase()} · proceeds ${fmtCurrency(report.totalProceeds, report.currency)} · short-term ${fmtCurrency(report.shortTermGainLoss, report.currency)} · long-term ${fmtCurrency(report.longTermGainLoss, report.currency)}`
            : 'Loading…'
        }
        actions={
          <>
            <div role="tablist" aria-label="Cost basis method" className="flex gap-1">
              {(['fifo', 'lifo', 'specific'] as CostBasisMethod[]).map((m) => (
                <button
                  type="button"
                  key={m}
                  role="tab"
                  aria-selected={method === m}
                  onClick={() => setMethod(m)}
                  className={[
                    'rounded-lg px-3 py-1.5 border text-[1.2rem] uppercase tracking-[0.06em]',
                    method === m
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-fg)] border-transparent'
                      : 'bg-transparent text-[var(--color-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface)]',
                  ].join(' ')}
                >
                  {m}
                </button>
              ))}
            </div>
            <Button variant="ghost" onClick={onExportCsv} disabled={!report}>
              Export 8949 CSV
            </Button>
          </>
        }
      >
        <DataTable<CostBasisLine>
          ariaLabel="Cost basis lines"
          rowKey={(r) => r.lotID}
          empty="No lots in this year."
          rows={report?.lines ?? []}
          columns={LOT_COLUMNS(report?.currency ?? 'USD')}
        />
      </Card>

      {sendOpen ? (
        <SendToCpaDialog
          taxYear={year}
          formIDs={Array.from(selectedForms)}
          onClose={() => setSendOpen(false)}
          onSent={() => {
            setSendOpen(false);
            setSelectedForms(new Set());
          }}
        />
      ) : null}
    </div>
  );
}

function TAX_COLUMNS(
  selected: Set<string>,
  toggle: (id: string) => void,
  activity: Record<string, string>,
  onView: (r: TaxFormRow) => void,
  onDownload: (r: TaxFormRow) => void,
): Column<TaxFormRow>[] {
  return [
    {
      key: 'sel',
      header: '',
      render: (r) => (
        <input
          type="checkbox"
          aria-label={`Select ${r.formType}`}
          checked={selected.has(r.id)}
          onChange={() => toggle(r.id)}
        />
      ),
    },
    {
      key: 'form',
      header: 'Form',
      render: (r) => (
        <div>
          <div className="font-medium">{TAX_FORM_LABEL[r.formType]}</div>
          <div className="text-[1.1rem] text-[var(--color-muted)]">
            {r.payerName} · TIN ending {r.recipientTinLast4}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span className="uppercase tracking-[0.06em] text-[1.1rem]">{r.status}</span>
      ),
    },
    {
      key: 'generatedAt',
      header: 'Generated',
      render: (r) => (r.generatedAt ? fmtDate(r.generatedAt) : '—'),
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
            <span className="text-[1.05rem] text-[var(--color-muted)] mr-2">
              {activity[r.id]}
            </span>
          ) : null}
          <Button variant="ghost" onClick={() => onView(r)}>
            View
          </Button>
          <Button variant="ghost" onClick={() => onDownload(r)}>
            Download
          </Button>
        </div>
      ),
    },
  ];
}

function LOT_COLUMNS(currency: string): Column<CostBasisLine>[] {
  return [
    {
      key: 'security',
      header: 'Security',
      render: (l) => (
        <div>
          <div className="font-medium">{l.securityName}</div>
          <div className="text-[1.1rem] text-[var(--color-muted)]">
            qty {l.quantity}
          </div>
        </div>
      ),
    },
    {
      key: 'acquired',
      header: 'Acquired',
      render: (l) => fmtDate(l.acquiredDate),
    },
    {
      key: 'sold',
      header: 'Sold',
      render: (l) => (l.dateSold ? fmtDate(l.dateSold) : 'open'),
    },
    {
      key: 'basis',
      header: 'Cost basis',
      align: 'right',
      render: (l) => fmtCurrency(l.totalCostBasis, currency),
    },
    {
      key: 'proceeds',
      header: 'Proceeds',
      align: 'right',
      render: (l) => (l.proceeds !== null ? fmtCurrency(l.proceeds, currency) : '—'),
    },
    {
      key: 'gain',
      header: 'Gain / loss',
      align: 'right',
      render: (l) =>
        l.realizedGainLoss !== null ? (
          <span className={signClass(l.realizedGainLoss)}>
            {fmtCurrency(l.realizedGainLoss, currency)}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'term',
      header: 'Term',
      render: (l) => l.term ?? '—',
    },
    {
      key: 'wash',
      header: 'Wash sale',
      render: (l) =>
        l.washSale ? (
          <span className="text-[var(--color-warning)]">Y</span>
        ) : (
          'N'
        ),
    },
  ];
}

function base64ToBytes(b64: string): Uint8Array {
  const bin =
    typeof atob === 'function'
      ? atob(b64)
      : Buffer.from(b64, 'base64').toString('binary');
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
