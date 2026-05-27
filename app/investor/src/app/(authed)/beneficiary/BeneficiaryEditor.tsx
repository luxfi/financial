'use client';

// Beneficiary slate editor. The editor enforces shares sum to 1 client-
// side; the backend re-validates. Submitting calls
// gateway.identity.setBeneficiaries which routes through
// transfer/pkg/legalprocess dual-control when the account is above
// issuer threshold.

import { useMemo, useState, useTransition } from 'react';
import { Button, Select } from '@/components/forms';
import { Notice } from '@/components/data';
import {
  gateway,
  type Beneficiary,
  type BeneficiaryRelationship,
  type BeneficiaryUpsertRequest,
} from '@/lib/gateway';

const RELATIONSHIPS: { value: BeneficiaryRelationship; label: string }[] = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'grandchild', label: 'Grandchild' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'trust', label: 'Trust' },
  { value: 'charity', label: 'Charity' },
  { value: 'other', label: 'Other' },
];

type Row = BeneficiaryUpsertRequest;

function fromExisting(b: Beneficiary): Row {
  return {
    id: b.id,
    legalName: b.legalName,
    relationship: b.relationship,
    share: b.share,
    dateOfBirth: b.dateOfBirth ?? '',
    countryCode: b.countryCode,
  };
}

function emptyRow(): Row {
  return {
    legalName: '',
    relationship: 'spouse',
    share: '',
    dateOfBirth: '',
    countryCode: 'US',
  };
}

function sumShares(rows: Row[]): number {
  let total = 0;
  for (const r of rows) {
    const n = Number(r.share);
    if (!Number.isFinite(n)) return NaN;
    total += n;
  }
  return total;
}

export function BeneficiaryEditor({ initial }: { initial: Beneficiary[] }) {
  const [rows, setRows] = useState<Row[]>(
    initial.length === 0 ? [emptyRow()] : initial.map(fromExisting),
  );
  const [busy, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const total = useMemo(() => sumShares(rows), [rows]);
  const sharesOk = Number.isFinite(total) && Math.abs(total - 1) < 1e-6;

  function update(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function remove(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  function add() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  function submit() {
    if (!sharesOk) {
      setErr(`Shares must sum to 1.00 (currently ${Number.isFinite(total) ? total.toFixed(4) : 'invalid'}).`);
      return;
    }
    startTransition(async () => {
      setErr(null);
      setOk(null);
      try {
        const updated = await gateway.identity.setBeneficiaries({
          beneficiaries: rows,
        });
        const pending = updated.filter((b) => b.status === 'pending_dual_control');
        if (pending.length > 0) {
          setOk(`Slate submitted. ${pending.length} designation(s) awaiting dual-control approval.`);
        } else {
          setOk('Slate updated.');
        }
        setRows(updated.map(fromExisting));
      } catch (e) {
        setErr((e as Error).message);
      }
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-3"
      aria-label="Beneficiary slate"
    >
      <table className="w-full border-collapse text-[1.3rem]">
        <thead>
          <tr>
            <th className="px-2 py-2 text-left text-[1.1rem] uppercase tracking-[0.06em] text-[var(--color-muted)] border-b border-[var(--color-border)]">
              Legal name
            </th>
            <th className="px-2 py-2 text-left text-[1.1rem] uppercase tracking-[0.06em] text-[var(--color-muted)] border-b border-[var(--color-border)]">
              Relationship
            </th>
            <th className="px-2 py-2 text-right text-[1.1rem] uppercase tracking-[0.06em] text-[var(--color-muted)] border-b border-[var(--color-border)]">
              Share
            </th>
            <th className="px-2 py-2 text-left text-[1.1rem] uppercase tracking-[0.06em] text-[var(--color-muted)] border-b border-[var(--color-border)]">
              Date of birth
            </th>
            <th className="px-2 py-2 text-left text-[1.1rem] uppercase tracking-[0.06em] text-[var(--color-muted)] border-b border-[var(--color-border)]">
              Country
            </th>
            <th className="px-2 py-2 text-right text-[1.1rem] uppercase tracking-[0.06em] text-[var(--color-muted)] border-b border-[var(--color-border)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id ?? `new-${i}`}>
              <td className="px-2 py-2 border-b border-[var(--color-border)]">
                <input
                  value={r.legalName}
                  onChange={(e) => update(i, { legalName: e.target.value })}
                  required
                  className="h-9 w-full px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
                />
              </td>
              <td className="px-2 py-2 border-b border-[var(--color-border)]">
                <Select
                  name={`relationship-${i}`}
                  value={r.relationship}
                  options={RELATIONSHIPS}
                  onChange={(e) =>
                    update(i, {
                      relationship: e.target.value as BeneficiaryRelationship,
                    })
                  }
                />
              </td>
              <td className="px-2 py-2 border-b border-[var(--color-border)] text-right">
                <input
                  value={r.share}
                  inputMode="decimal"
                  pattern="^0?\.\d+$|^1(\.0+)?$|^0$"
                  required
                  onChange={(e) => update(i, { share: e.target.value })}
                  className="h-9 w-24 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem] tabular-nums text-right"
                />
              </td>
              <td className="px-2 py-2 border-b border-[var(--color-border)]">
                <input
                  type="date"
                  value={r.dateOfBirth}
                  onChange={(e) => update(i, { dateOfBirth: e.target.value })}
                  required
                  className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
                />
              </td>
              <td className="px-2 py-2 border-b border-[var(--color-border)]">
                <input
                  value={r.countryCode}
                  onChange={(e) =>
                    update(i, { countryCode: e.target.value.toUpperCase() })
                  }
                  pattern="^[A-Z]{2}$"
                  required
                  className="h-9 w-16 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
                />
              </td>
              <td className="px-2 py-2 border-b border-[var(--color-border)] text-right">
                {rows.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(i)}
                    disabled={busy}
                  >
                    Remove
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
          <tr>
            <td
              className="px-2 py-2 text-right font-medium"
              colSpan={2}
            >
              Total share
            </td>
            <td
              className={[
                'px-2 py-2 text-right tabular-nums',
                sharesOk
                  ? 'text-[var(--color-success)]'
                  : 'text-[var(--color-warning)]',
              ].join(' ')}
            >
              {Number.isFinite(total) ? total.toFixed(4) : '—'}
            </td>
            <td colSpan={3}></td>
          </tr>
        </tbody>
      </table>

      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={add} disabled={busy}>
          Add beneficiary
        </Button>
        <Button type="submit" disabled={busy || !sharesOk}>
          Submit slate
        </Button>
      </div>

      {err ? <Notice tone="error">{err}</Notice> : null}
      {ok ? <Notice tone="success">{ok}</Notice> : null}
    </form>
  );
}
