'use client';

// SendToCpaDialog — scoped, time-limited link bundling the selected tax
// forms (optionally with the cost-basis report) for the investor's CPA.

import { useState } from 'react';
import { Button } from '@/components/forms';
import { Notice } from '@/components/data';
import { tax, type SendToCpaResult } from '@/lib/gateway/tax';

export interface SendToCpaDialogProps {
  taxYear: number;
  formIDs: string[];
  onClose: () => void;
  onSent: () => void;
}

const EXPIRY_PRESETS: Array<{ label: string; days: number }> = [
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
];

export function SendToCpaDialog({
  taxYear,
  formIDs,
  onClose,
  onSent,
}: SendToCpaDialogProps) {
  const [email, setEmail] = useState('');
  const [cpaName, setCpaName] = useState('');
  const [includeCostBasis, setIncludeCostBasis] = useState(true);
  const [expiryDays, setExpiryDays] = useState(14);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SendToCpaResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError('CPA email is required.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const expiresAt = new Date(
        Date.now() + expiryDays * 24 * 60 * 60 * 1000,
      ).toISOString();
      const r = await tax.sendToCpa({
        taxYear,
        formIDs,
        includeCostBasis,
        cpaEmail: email.trim(),
        cpaName: cpaName.trim() || undefined,
        expiresAt,
      });
      setResult(r);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function copyLink() {
    if (result) navigator.clipboard?.writeText(result.url);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Send tax docs to CPA"
      data-testid="cpa-dialog"
      className="fixed inset-0 bg-black/60 grid place-items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 w-[480px] max-w-[92vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-4">
          <h2 className="text-[1.6rem] font-semibold">Send to my CPA</h2>
          <p className="text-[1.2rem] text-[var(--color-muted)] mt-1">
            {formIDs.length} form{formIDs.length === 1 ? '' : 's'} for tax year{' '}
            {taxYear}. Every click of the resulting link is audit-logged.
          </p>
        </header>

        {result ? (
          <div className="space-y-3">
            <Notice tone="success">
              Link generated. Expires{' '}
              {new Date(result.expiresAt).toLocaleString()}. {result.formCount}{' '}
              forms attached.
            </Notice>
            <label className="block text-[1.2rem] text-[var(--color-secondary)]">
              Share URL
              <input
                readOnly
                value={result.url}
                aria-label="CPA share URL"
                className="mt-1 h-10 w-full rounded-lg px-3 bg-[var(--color-background)] border border-[var(--color-border)] text-[1.3rem] font-mono"
                onFocus={(e) => e.currentTarget.select()}
              />
            </label>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={copyLink}>
                Copy link
              </Button>
              <Button variant="primary" onClick={onSent}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={onSubmit}>
            <label className="block text-[1.2rem] text-[var(--color-secondary)]">
              CPA email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cpa@firm.example"
                className="mt-1 h-10 w-full rounded-lg px-3 bg-[var(--color-background)] border border-[var(--color-border)] text-[1.3rem]"
              />
            </label>
            <label className="block text-[1.2rem] text-[var(--color-secondary)]">
              CPA name (optional)
              <input
                type="text"
                value={cpaName}
                onChange={(e) => setCpaName(e.target.value)}
                placeholder="Jane Doe, CPA"
                className="mt-1 h-10 w-full rounded-lg px-3 bg-[var(--color-background)] border border-[var(--color-border)] text-[1.3rem]"
              />
            </label>
            <label className="text-[1.3rem] flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={includeCostBasis}
                onChange={(e) => setIncludeCostBasis(e.target.checked)}
              />
              Include cost-basis report (8949 CSV)
            </label>
            <fieldset className="flex gap-2">
              <legend className="text-[1.2rem] text-[var(--color-secondary)] mb-1">
                Expires in
              </legend>
              {EXPIRY_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.days}
                  onClick={() => setExpiryDays(p.days)}
                  className={[
                    'rounded-lg px-3 py-1.5 border text-[1.2rem]',
                    expiryDays === p.days
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-fg)] border-transparent'
                      : 'bg-transparent border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]',
                  ].join(' ')}
                >
                  {p.label}
                </button>
              ))}
            </fieldset>
            {error ? <Notice tone="error">{error}</Notice> : null}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={busy}>
                {busy ? 'Generating…' : 'Generate link'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
