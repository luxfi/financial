'use client';

// KYC refresh form — US investors submit refreshed PII + W-9; non-US
// submit refreshed PII + W-8 (form-type picker). The TIN is tokenised
// client-side; the raw number never hits the gateway in cleartext (in
// production the token is minted by a payment-side equivalent of
// Stripe Tax IDs; the placeholder here keeps the shape).
//
// On submit the gateway posts to captable/pkg/kyc and to
// broker/pkg/provider/northcapital.PerformKYC.

import { useState, useTransition } from 'react';
import { Button, Select } from '@/components/forms';
import { Notice } from '@/components/data';
import { AddressFields } from './AddressFields';
import {
  gateway,
  type IdentityProfile,
  type PostalAddress,
  type TaxForm,
  type W8FormType,
  type W9TaxClassification,
} from '@/lib/gateway';

const W8_OPTIONS: { value: W8FormType; label: string }[] = [
  { value: 'w8ben', label: 'W-8BEN (individual)' },
  { value: 'w8bene', label: 'W-8BEN-E (entity)' },
  { value: 'w8imy', label: 'W-8IMY (intermediary)' },
  { value: 'w8eci', label: 'W-8ECI (effectively connected income)' },
  { value: 'w8exp', label: 'W-8EXP (government / exempt org)' },
];

const W9_CLASSIFICATIONS: { value: W9TaxClassification; label: string }[] = [
  { value: 'individual_sole_prop', label: 'Individual / sole proprietor' },
  { value: 'c_corp', label: 'C corporation' },
  { value: 's_corp', label: 'S corporation' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'trust_estate', label: 'Trust / estate' },
  { value: 'llc', label: 'LLC' },
];

// Placeholder tokeniser. In production the form mounts a payment-side
// element that vault-tokenises the TIN; the cleartext never crosses
// the browser <-> origin boundary. The placeholder here returns a
// stable digest so the gateway can validate shape.
async function tokeniseTIN(tin: string): Promise<string> {
  const enc = new TextEncoder().encode(tin);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  const arr = new Uint8Array(buf);
  let hex = '';
  for (const b of arr) hex += b.toString(16).padStart(2, '0');
  return `tin_${hex.slice(0, 32)}`;
}

export function KYCRefreshForm({
  profile,
  isUS,
}: {
  profile: IdentityProfile;
  isUS: boolean;
}) {
  const [legalName, setLegalName] = useState(profile.legalName);
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState<PostalAddress>(profile.address);
  const [w8Type, setW8Type] = useState<W8FormType>(
    profile.taxForm.type === 'w9' ? 'w8ben' : (profile.taxForm.type as W8FormType),
  );

  // W-9 fields
  const [tin, setTin] = useState('');
  const [classification, setClassification] = useState<W9TaxClassification>(
    'individual_sole_prop',
  );
  const [backup, setBackup] = useState(false);

  // W-8 fields
  const [foreignTIN, setForeignTIN] = useState('');
  const [treatyCountry, setTreatyCountry] = useState(profile.countryOfTaxResidence);
  const [treatyArticle, setTreatyArticle] = useState('');
  const [treatyRate, setTreatyRate] = useState('0.00');

  const [busy, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function submit() {
    startTransition(async () => {
      setErr(null);
      setOk(null);
      try {
        const taxForm: TaxForm = isUS ? 'w9' : w8Type;
        const req = {
          taxForm,
          legalName,
          dateOfBirth: dob,
          address,
          ...(isUS
            ? {
                w9: {
                  tinTokenized: await tokeniseTIN(tin),
                  classification,
                  backupWithholding: backup,
                },
              }
            : {
                w8: {
                  formType: w8Type,
                  foreignTIN,
                  treatyCountry,
                  treatyArticle,
                  treatyRate,
                },
              }),
        };
        await gateway.identity.refreshKYC(req);
        setOk('KYC pack submitted. The TA will email you when verification completes.');
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
      aria-label="KYC refresh"
    >
      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Legal name
          <input
            value={legalName}
            onChange={(e) => setLegalName(e.target.value)}
            required
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Date of birth
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
          />
        </label>
      </div>

      <AddressFields value={address} onChange={setAddress} />

      {isUS ? (
        <>
          <Select
            label="W-9 tax classification"
            name="classification"
            value={classification}
            options={W9_CLASSIFICATIONS}
            onChange={(e) =>
              setClassification(e.target.value as W9TaxClassification)
            }
          />
          <label className="flex flex-col gap-1 text-[1.2rem]">
            TIN (SSN / EIN) — tokenised in your browser
            <input
              value={tin}
              onChange={(e) => setTin(e.target.value)}
              required
              pattern="^[0-9]{9}$"
              inputMode="numeric"
              autoComplete="off"
              className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem] font-mono"
            />
          </label>
          <label className="text-[1.3rem] flex items-center gap-2">
            <input
              type="checkbox"
              checked={backup}
              onChange={(e) => setBackup(e.target.checked)}
            />
            I am subject to backup withholding (IRS notice)
          </label>
        </>
      ) : (
        <>
          <Select
            label="W-8 form type"
            name="w8Type"
            value={w8Type}
            options={W8_OPTIONS}
            onChange={(e) => setW8Type(e.target.value as W8FormType)}
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
        </>
      )}

      <Button type="submit" disabled={busy} className="self-start">
        Submit refresh
      </Button>

      {err ? <Notice tone="error">{err}</Notice> : null}
      {ok ? <Notice tone="success">{ok}</Notice> : null}
    </form>
  );
}
