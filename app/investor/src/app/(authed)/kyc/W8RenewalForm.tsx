'use client';

// W-8 renewal — submits a fresh W-8BEN / W-8BEN-E / W-8IMY / W-8ECI /
// W-8EXP per Treasury Reg §1.1441-1(e). Withholding rate is updated by
// captable/pkg/tax once the gateway accepts.

import { useState, useTransition } from 'react';
import { Button, Select } from '@/components/forms';
import { Notice } from '@/components/data';
import {
  gateway,
  type IdentityProfile,
  type W8FormType,
} from '@/lib/gateway';

const W8_OPTIONS: { value: W8FormType; label: string }[] = [
  { value: 'w8ben', label: 'W-8BEN (individual beneficial owner)' },
  { value: 'w8bene', label: 'W-8BEN-E (entity beneficial owner)' },
  { value: 'w8imy', label: 'W-8IMY (intermediary)' },
  { value: 'w8eci', label: 'W-8ECI (effectively-connected income)' },
  { value: 'w8exp', label: 'W-8EXP (foreign government / exempt org)' },
];

export function W8RenewalForm({ profile }: { profile: IdentityProfile }) {
  const initial =
    profile.taxForm.type === 'w9' ? 'w8ben' : (profile.taxForm.type as W8FormType);
  const [formType, setFormType] = useState<W8FormType>(initial);
  const [foreignTIN, setForeignTIN] = useState('');
  const [treatyCountry, setTreatyCountry] = useState(
    profile.countryOfTaxResidence,
  );
  const [treatyArticle, setTreatyArticle] = useState('');
  const [treatyRate, setTreatyRate] = useState('0.00');
  const [attest, setAttest] = useState(false);
  const [busy, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function submit() {
    if (!attest) {
      setErr('You must attest beneficial-owner status under Reg §1.1441-1(e).');
      return;
    }
    startTransition(async () => {
      setErr(null);
      setOk(null);
      try {
        await gateway.identity.renewW8({
          formType,
          foreignTIN,
          treatyCountry,
          treatyArticle,
          treatyRate,
          attestation: attest,
        });
        setOk('W-8 renewal submitted. Your withholding rate will update on the next distribution.');
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
      aria-label="W-8 renewal"
    >
      <Select
        label="W-8 form type"
        name="formType"
        value={formType}
        options={W8_OPTIONS}
        onChange={(e) => setFormType(e.target.value as W8FormType)}
      />
      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Foreign TIN
          <input
            value={foreignTIN}
            onChange={(e) => setForeignTIN(e.target.value)}
            required
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem] font-mono"
          />
        </label>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Treaty country (ISO)
          <input
            value={treatyCountry}
            onChange={(e) => setTreatyCountry(e.target.value.toUpperCase())}
            required
            pattern="^[A-Z]{2}$"
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Treaty article
          <input
            value={treatyArticle}
            onChange={(e) => setTreatyArticle(e.target.value)}
            required
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Treaty rate (decimal)
          <input
            value={treatyRate}
            onChange={(e) => setTreatyRate(e.target.value)}
            required
            pattern="^0\.[0-9]{1,4}$|^0$"
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem] tabular-nums"
          />
        </label>
      </div>

      <label className="text-[1.3rem] flex items-start gap-2">
        <input
          type="checkbox"
          checked={attest}
          onChange={(e) => setAttest(e.target.checked)}
          className="mt-1"
        />
        <span>
          I am the beneficial owner of the income to which this form relates
          (or am authorised to sign for the beneficial owner) and the
          information on this form is true, correct, and complete, per
          Treas. Reg. §1.1441-1(e).
        </span>
      </label>

      <Button type="submit" disabled={busy} className="self-start">
        Submit W-8 renewal
      </Button>
      {err ? <Notice tone="error">{err}</Notice> : null}
      {ok ? <Notice tone="success">{ok}</Notice> : null}
    </form>
  );
}
