'use client';

// ShareDialog — scoped, time-limited share-with-advisor link generator.
// Mirrors the same pattern used by tax /send-to-cpa.
//
// The dialog lets the investor:
//   * type a recipient email (advisor / lawyer / accountant)
//   * pick a scope (view-only or download)
//   * pick an expiry (1 / 7 / 14 days — capped server-side at 14)
//   * attach a short note
//
// On submit the gateway returns a URL the investor copies and sends out-
// of-band. The share grant is audit-logged on creation and on each click
// of the resulting link.

import { useState } from 'react';
import { Button } from '@/components/forms';
import { Notice } from '@/components/data';
import {
  document as documentClient,
  type DocumentRow,
  type ShareLink,
} from '@/lib/gateway/document';

export interface ShareDialogProps {
  row: DocumentRow;
  onClose: () => void;
}

const EXPIRY_PRESETS: Array<{ label: string; days: number }> = [
  { label: '1 day', days: 1 },
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
];

export function ShareDialog({ row, onClose }: ShareDialogProps) {
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState<'view' | 'download'>('view');
  const [expiryDays, setExpiryDays] = useState(7);
  const [note, setNote] = useState('');
  const [result, setResult] = useState<ShareLink | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Recipient email is required.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const expiresAt = new Date(
        Date.now() + expiryDays * 24 * 60 * 60 * 1000,
      ).toISOString();
      const link = await documentClient.share({
        documentID: row.id,
        recipientEmail: email.trim(),
        expiresAt,
        scope,
        note: note.trim() || undefined,
      });
      setResult(link);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function copyLink() {
    if (!result) return;
    navigator.clipboard?.writeText(result.url);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share with advisor"
      data-testid="share-dialog"
      className="fixed inset-0 bg-black/60 grid place-items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 w-[480px] max-w-[92vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-4">
          <h2 className="text-[1.6rem] font-semibold">Share with advisor</h2>
          <p className="text-[1.2rem] text-[var(--color-muted)] mt-1">
            Generate a scoped, time-limited link to {row.name}. Every click is
            audit-logged.
          </p>
        </header>

        {result ? (
          <div className="space-y-3">
            <Notice tone="success">
              Link generated. Expires {new Date(result.expiresAt).toLocaleString()}.
            </Notice>
            <label className="block text-[1.2rem] text-[var(--color-secondary)]">
              Share URL
              <input
                readOnly
                value={result.url}
                aria-label="Share URL"
                className="mt-1 h-10 w-full rounded-lg px-3 bg-[var(--color-background)] border border-[var(--color-border)] text-[1.3rem] font-mono"
                onFocus={(e) => e.currentTarget.select()}
              />
            </label>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={copyLink}>
                Copy link
              </Button>
              <Button variant="primary" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={onSubmit}>
            <label className="block text-[1.2rem] text-[var(--color-secondary)]">
              Recipient email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="advisor@example.com"
                className="mt-1 h-10 w-full rounded-lg px-3 bg-[var(--color-background)] border border-[var(--color-border)] text-[1.3rem]"
              />
            </label>

            <fieldset className="flex gap-4">
              <legend className="text-[1.2rem] text-[var(--color-secondary)] mb-1">
                Permission
              </legend>
              {(['view', 'download'] as const).map((s) => (
                <label
                  key={s}
                  className="text-[1.3rem] flex items-center gap-1.5"
                >
                  <input
                    type="radio"
                    name="scope"
                    value={s}
                    checked={scope === s}
                    onChange={() => setScope(s)}
                  />
                  {s === 'view' ? 'View only' : 'View + download'}
                </label>
              ))}
            </fieldset>

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

            <label className="block text-[1.2rem] text-[var(--color-secondary)]">
              Note (optional)
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Why you're sharing this document."
                rows={3}
                className="mt-1 w-full rounded-lg px-3 py-2 bg-[var(--color-background)] border border-[var(--color-border)] text-[1.3rem]"
              />
            </label>

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
