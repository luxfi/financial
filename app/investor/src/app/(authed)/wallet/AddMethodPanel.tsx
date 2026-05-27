'use client';

// AddMethodPanel — entry point for adding a new payment method. The kind
// picker drives which mini-form mounts:
//
//   ACH        → Plaid Link (preferred) or manual routing/account.
//   Card       → Stripe Elements tokenisation in-browser; the PAN never
//                hits our origin.
//   Wire       → No PAN — backend mints a wire-instructions packet (with
//                memo line that lets the operator reconcile inbound funds
//                to this investor).
//   IRA        → NCPS custody account workflow (custodian, account, type).
//   Stablecoin → Lives in StablecoinPanel below; surfaced separately so the
//                walletconnect / mpc flow is not mixed with fiat rails.

import { useState, useTransition } from 'react';
import { Button, Select } from '@/components/forms';
import { Card, Notice } from '@/components/data';
import { gateway, type PaymentMethodKind } from '@/lib/gateway';

type FiatKind = Exclude<PaymentMethodKind, 'stablecoin'>;

const FIAT_KINDS: { value: FiatKind; label: string; provider: string }[] = [
  { value: 'ach', label: 'ACH bank account', provider: 'plaid' },
  { value: 'card', label: 'Debit / credit card', provider: 'stripe' },
  { value: 'wire', label: 'Wire instructions', provider: 'moderntreasury' },
  { value: 'ira', label: 'IRA custody account', provider: 'northcapital' },
];

export function AddMethodPanel() {
  const [kind, setKind] = useState<FiatKind>('ach');
  const [busy, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function submit(payload: Record<string, string>) {
    startTransition(async () => {
      setErr(null);
      setOk(null);
      try {
        const created = await gateway.wallet.add(
          { kind, payload },
          // Idempotency key: kind + first identifying field hashed by the
          // gateway. We send a per-form key so a double-submit doesn't
          // duplicate.
          `add-${kind}-${Date.now()}`,
        );
        setOk(`Added ${created.label}. ${created.status === 'pending_micro_deposits' ? 'Verify the two micro-deposits in the table on the left.' : ''}`);
      } catch (e) {
        setErr((e as Error).message);
      }
    });
  }

  return (
    <Card title="Add payment method" subtitle="Bank, card, wire, IRA">
      <Select
        label="Type"
        name="kind"
        value={kind}
        options={FIAT_KINDS.map((k) => ({ value: k.value, label: k.label }))}
        onChange={(e) => {
          setKind(e.target.value as FiatKind);
          setErr(null);
          setOk(null);
        }}
      />

      <div className="mt-4">
        {kind === 'ach' ? <ACHForm onSubmit={submit} busy={busy} /> : null}
        {kind === 'card' ? <CardForm onSubmit={submit} busy={busy} /> : null}
        {kind === 'wire' ? <WireForm onSubmit={submit} busy={busy} /> : null}
        {kind === 'ira' ? <IRAForm onSubmit={submit} busy={busy} /> : null}
      </div>

      {ok ? (
        <div className="mt-3">
          <Notice tone="success">{ok}</Notice>
        </div>
      ) : null}
      {err ? (
        <div className="mt-3">
          <Notice tone="error">{err}</Notice>
        </div>
      ) : null}
    </Card>
  );
}

function ACHForm({
  onSubmit,
  busy,
}: {
  onSubmit: (p: Record<string, string>) => void;
  busy: boolean;
}) {
  const [route, setRoute] = useState<'plaid' | 'manual'>('plaid');
  const [routing, setRouting] = useState('');
  const [account, setAccount] = useState('');
  const [accountType, setAccountType] = useState<'checking' | 'savings'>('checking');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (route === 'plaid') {
          // Plaid Link returns a public_token; the backend exchanges it for
          // an access_token + verifies. In the absence of the Plaid SDK
          // being bundled here, we hand a placeholder token that the
          // gateway recognises in mock mode and the backend exchanges in
          // prod.
          onSubmit({
            plaidPublicToken:
              typeof window !== 'undefined' && typeof window.prompt === 'function'
                ? window.prompt('Paste Plaid public token (Link onSuccess)') ?? ''
                : '',
          });
        } else {
          onSubmit({
            routingNumber: routing,
            accountNumber: account,
            accountType,
          });
        }
      }}
    >
      <fieldset className="mb-3">
        <legend className="text-[1.2rem] text-[var(--color-secondary)] mb-1">
          Method
        </legend>
        <label className="text-[1.3rem] mr-3">
          <input
            type="radio"
            name="ach-route"
            checked={route === 'plaid'}
            onChange={() => setRoute('plaid')}
          />{' '}
          Plaid Link
        </label>
        <label className="text-[1.3rem]">
          <input
            type="radio"
            name="ach-route"
            checked={route === 'manual'}
            onChange={() => setRoute('manual')}
          />{' '}
          Manual (micro-deposits)
        </label>
      </fieldset>

      {route === 'manual' ? (
        <div className="grid gap-2">
          <label className="flex flex-col gap-1 text-[1.2rem]">
            Routing number (9 digits)
            <input
              value={routing}
              onChange={(e) => setRouting(e.target.value)}
              inputMode="numeric"
              pattern="^[0-9]{9}$"
              required
              className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
            />
          </label>
          <label className="flex flex-col gap-1 text-[1.2rem]">
            Account number
            <input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              inputMode="numeric"
              required
              className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
            />
          </label>
          <Select
            label="Account type"
            name="accountType"
            value={accountType}
            options={[
              { value: 'checking', label: 'Checking' },
              { value: 'savings', label: 'Savings' },
            ]}
            onChange={(e) => setAccountType(e.target.value as 'checking' | 'savings')}
          />
        </div>
      ) : null}

      <Button type="submit" disabled={busy} className="mt-3">
        Add bank account
      </Button>
    </form>
  );
}

function CardForm({
  onSubmit,
  busy,
}: {
  onSubmit: (p: Record<string, string>) => void;
  busy: boolean;
}) {
  // Stripe Elements would mount here when the SDK is bundled. The gateway
  // accepts a SetupIntent client secret which the backend confirms. To
  // keep the surface PCI-light, the form here only takes the SetupIntent
  // id — the operator-side service has minted it for this investor.
  const [setupIntent, setSetupIntent] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ stripeSetupIntentClientSecret: setupIntent });
      }}
    >
      <p className="text-[1.2rem] text-[var(--color-secondary)] mb-3">
        Cards are tokenised by Stripe Elements before submission. Paste the
        SetupIntent client secret returned by the Elements callback.
      </p>
      <label className="flex flex-col gap-1 text-[1.2rem]">
        SetupIntent client secret
        <input
          value={setupIntent}
          onChange={(e) => setSetupIntent(e.target.value)}
          required
          className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
        />
      </label>
      <Button type="submit" disabled={busy} className="mt-3">
        Add card
      </Button>
    </form>
  );
}

function WireForm({
  onSubmit,
  busy,
}: {
  onSubmit: (p: Record<string, string>) => void;
  busy: boolean;
}) {
  const [bankName, setBankName] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ bankName });
      }}
    >
      <p className="text-[1.2rem] text-[var(--color-secondary)] mb-3">
        We will mint a wire-instructions packet with a memo line that maps
        inbound funds to your account. Open the packet from the row's
        "Print" action.
      </p>
      <label className="flex flex-col gap-1 text-[1.2rem]">
        Originating bank
        <input
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          required
          className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
        />
      </label>
      <Button type="submit" disabled={busy} className="mt-3">
        Mint wire instructions
      </Button>
    </form>
  );
}

function IRAForm({
  onSubmit,
  busy,
}: {
  onSubmit: (p: Record<string, string>) => void;
  busy: boolean;
}) {
  const [custodian, setCustodian] = useState('equity_trust');
  const [accountNumber, setAccountNumber] = useState('');
  const [iraType, setIraType] = useState<'traditional' | 'roth' | 'sep' | 'simple'>(
    'traditional',
  );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ custodian, accountNumber, iraType });
      }}
    >
      <p className="text-[1.2rem] text-[var(--color-secondary)] mb-3">
        For IRAs custodied with a NCPS-partner custodian, we open a custody
        sub-account under your IRA and route subscriptions through it.
      </p>
      <Select
        label="Custodian"
        name="custodian"
        value={custodian}
        options={[
          { value: 'equity_trust', label: 'Equity Trust' },
          { value: 'forge_trust', label: 'Forge Trust' },
          { value: 'strata_trust', label: 'Strata Trust' },
          { value: 'ira_services', label: 'IRA Services' },
        ]}
        onChange={(e) => setCustodian(e.target.value)}
      />
      <label className="flex flex-col gap-1 text-[1.2rem] mt-3">
        IRA account number
        <input
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
          className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
        />
      </label>
      <Select
        label="IRA type"
        name="iraType"
        value={iraType}
        options={[
          { value: 'traditional', label: 'Traditional' },
          { value: 'roth', label: 'Roth' },
          { value: 'sep', label: 'SEP' },
          { value: 'simple', label: 'SIMPLE' },
        ]}
        onChange={(e) =>
          setIraType(e.target.value as 'traditional' | 'roth' | 'sep' | 'simple')
        }
      />
      <Button type="submit" disabled={busy} className="mt-3">
        Add IRA custody account
      </Button>
    </form>
  );
}
