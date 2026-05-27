'use client';

// Client-side payment-methods table. The server delivers the initial
// snapshot; per-row mutations (verify / set-default / unlink) round-trip
// through the gateway and refresh local state — no full-page reload.
//
// Action affordances vary by status:
//   - 'pending_micro_deposits' → "Verify" opens a two-amount entry mini-form
//   - 'verified'               → "Make default" (settlement / distributions)
//                                 + "Unlink"
//   - 'unverified' | 'failed'  → "Retry verification" (re-runs link flow)
//   - 'closed'                 → row is shown for audit context only
//
// The wire-instructions kind has its own "Print" action that opens the
// printable instructions sheet in a new tab.

import { useMemo, useState, useTransition } from 'react';
import { Button } from '@/components/forms';
import { DataTable, Notice } from '@/components/data';
import type { Column } from '@/components/data';
import { gateway, type PaymentMethod } from '@/lib/gateway';
import { fmtDateTime } from '@/lib/format';

const KIND_LABEL: Record<PaymentMethod['kind'], string> = {
  ach: 'ACH bank',
  card: 'Card',
  wire: 'Wire',
  ira: 'IRA',
  stablecoin: 'Stablecoin',
};

const STATUS_LABEL: Record<PaymentMethod['status'], string> = {
  unverified: 'Unverified',
  pending_micro_deposits: 'Pending micro-deposits',
  verified: 'Verified',
  failed: 'Failed',
  closed: 'Closed',
};

const STATUS_TONE: Record<PaymentMethod['status'], string> = {
  unverified: 'text-[var(--color-muted)]',
  pending_micro_deposits: 'text-[var(--color-warning)]',
  verified: 'text-[var(--color-success)]',
  failed: 'text-[var(--color-danger)]',
  closed: 'text-[var(--color-muted)]',
};

interface VerifyForm {
  id: string;
  amount1: string;
  amount2: string;
}

export function MethodsTable({ initialMethods }: { initialMethods: PaymentMethod[] }) {
  const [methods, setMethods] = useState(initialMethods);
  const [verify, setVerify] = useState<VerifyForm | null>(null);
  const [busy, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function replace(updated: PaymentMethod) {
    setMethods((prev) => {
      // For default toggling, ensure only one default per use.
      const next = prev.map((m) => {
        if (m.id === updated.id) return updated;
        const m2 = { ...m };
        if (updated.defaultForSettlement && m2.id !== updated.id) {
          m2.defaultForSettlement = false;
        }
        if (updated.defaultForDistributions && m2.id !== updated.id) {
          m2.defaultForDistributions = false;
        }
        return m2;
      });
      return next;
    });
  }

  function remove(id: string) {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  }

  function doVerify(form: VerifyForm) {
    startTransition(async () => {
      setErr(null);
      setOk(null);
      try {
        const updated = await gateway.wallet.verify(form.id, {
          amount1: form.amount1,
          amount2: form.amount2,
        });
        replace(updated);
        setOk(`Verified ${updated.label}.`);
        setVerify(null);
      } catch (e) {
        setErr((e as Error).message);
      }
    });
  }

  function doSetDefault(id: string, use: 'settlement' | 'distributions') {
    startTransition(async () => {
      setErr(null);
      setOk(null);
      try {
        const updated = await gateway.wallet.setDefault(id, use);
        replace(updated);
        setOk(`${updated.label} is now your ${use} default.`);
      } catch (e) {
        setErr((e as Error).message);
      }
    });
  }

  function doUnlink(id: string, label: string) {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`Unlink ${label}? You can add it again later, but not undo this unlink.`)
    ) {
      return;
    }
    startTransition(async () => {
      setErr(null);
      setOk(null);
      try {
        await gateway.wallet.unlink(id);
        remove(id);
        setOk(`Unlinked ${label}.`);
      } catch (e) {
        setErr((e as Error).message);
      }
    });
  }

  const columns: Column<PaymentMethod>[] = useMemo(
    () => [
      {
        key: 'kind',
        header: 'Type',
        render: (m) => (
          <div className="flex flex-col">
            <span className="font-medium">{KIND_LABEL[m.kind]}</span>
            <span className="text-[1.1rem] text-[var(--color-muted)]">{m.provider}</span>
          </div>
        ),
      },
      {
        key: 'label',
        header: 'Account',
        render: (m) => (
          <div className="flex flex-col">
            <span>{m.label}</span>
            {m.bankName ? (
              <span className="text-[1.1rem] text-[var(--color-muted)]">{m.bankName}</span>
            ) : null}
          </div>
        ),
      },
      { key: 'currency', header: 'Ccy', render: (m) => m.currency },
      {
        key: 'status',
        header: 'Status',
        render: (m) => (
          <span className={STATUS_TONE[m.status]}>{STATUS_LABEL[m.status]}</span>
        ),
      },
      {
        key: 'defaults',
        header: 'Defaults',
        render: (m) => {
          const parts: string[] = [];
          if (m.defaultForSettlement) parts.push('Settlement');
          if (m.defaultForDistributions) parts.push('Distributions');
          return parts.length === 0 ? (
            <span className="text-[var(--color-muted)]">—</span>
          ) : (
            <span>{parts.join(' · ')}</span>
          );
        },
      },
      {
        key: 'lastUsed',
        header: 'Last used',
        render: (m) =>
          m.lastUsedAt ? (
            fmtDateTime(m.lastUsedAt)
          ) : (
            <span className="text-[var(--color-muted)]">Never</span>
          ),
      },
      {
        key: 'actions',
        header: 'Actions',
        align: 'right',
        render: (m) => {
          if (m.status === 'pending_micro_deposits') {
            return (
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => setVerify({ id: m.id, amount1: '', amount2: '' })}
              >
                Verify
              </Button>
            );
          }
          if (m.kind === 'wire') {
            const href = m.wireInstructionsRef
              ? `/api/wallet/wire-instructions/${encodeURIComponent(m.wireInstructionsRef)}`
              : '#';
            return (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-foreground)] underline text-[1.3rem]"
              >
                Print
              </a>
            );
          }
          if (m.status === 'verified') {
            return (
              <div className="flex justify-end gap-2 flex-wrap">
                {!m.defaultForSettlement ? (
                  <Button
                    variant="ghost"
                    disabled={busy}
                    onClick={() => doSetDefault(m.id, 'settlement')}
                  >
                    Default · settlement
                  </Button>
                ) : null}
                {!m.defaultForDistributions ? (
                  <Button
                    variant="ghost"
                    disabled={busy}
                    onClick={() => doSetDefault(m.id, 'distributions')}
                  >
                    Default · distributions
                  </Button>
                ) : null}
                <Button
                  variant="danger"
                  disabled={busy}
                  onClick={() => doUnlink(m.id, m.label)}
                >
                  Unlink
                </Button>
              </div>
            );
          }
          return <span className="text-[var(--color-muted)]">—</span>;
        },
      },
    ],
    [busy],
  );

  return (
    <>
      {ok ? (
        <div className="mb-3">
          <Notice tone="success">{ok}</Notice>
        </div>
      ) : null}
      {err ? (
        <div className="mb-3">
          <Notice tone="error">{err}</Notice>
        </div>
      ) : null}

      <DataTable
        ariaLabel="Payment methods"
        rows={methods}
        rowKey={(m) => m.id}
        columns={columns}
        empty="No fiat or custody payment methods linked yet."
      />

      {verify ? (
        <VerifyMicroDeposits
          form={verify}
          onCancel={() => setVerify(null)}
          onChange={setVerify}
          onSubmit={doVerify}
          busy={busy}
        />
      ) : null}
    </>
  );
}

function VerifyMicroDeposits({
  form,
  onCancel,
  onChange,
  onSubmit,
  busy,
}: {
  form: VerifyForm;
  onCancel: () => void;
  onChange: (f: VerifyForm) => void;
  onSubmit: (f: VerifyForm) => void;
  busy: boolean;
}) {
  return (
    <form
      className="mt-4 p-4 border border-[var(--color-border)] rounded-xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      aria-label="Verify micro-deposits"
    >
      <div className="text-[1.3rem] font-semibold mb-2">
        Enter the two micro-deposit amounts
      </div>
      <p className="text-[1.2rem] text-[var(--color-secondary)] mb-3">
        Plaid sent two small deposits to this account. Enter the cent amounts
        exactly (e.g. 0.07 and 0.11). Three failed attempts will close this
        method automatically.
      </p>
      <div className="flex gap-3 items-end">
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Amount 1
          <input
            value={form.amount1}
            inputMode="decimal"
            required
            pattern="^0?\.[0-9]{2}$"
            onChange={(e) => onChange({ ...form, amount1: e.target.value })}
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Amount 2
          <input
            value={form.amount2}
            inputMode="decimal"
            required
            pattern="^0?\.[0-9]{2}$"
            onChange={(e) => onChange({ ...form, amount2: e.target.value })}
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
          />
        </label>
        <Button type="submit" disabled={busy}>
          Verify
        </Button>
        <Button type="button" variant="ghost" disabled={busy} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
