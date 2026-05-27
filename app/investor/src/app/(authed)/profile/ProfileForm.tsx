'use client';

// Address change form. Reason picker drives the audit-log row. Effective
// date can be future-dated (queued in beneficial-owner workflow). The
// backend re-screens OFAC after a successful submit and surfaces any
// flag to the user's inbox.

import { useState, useTransition } from 'react';
import { Button, Select } from '@/components/forms';
import { Notice } from '@/components/data';
import { AddressFields } from '../kyc/AddressFields';
import {
  gateway,
  type AddressChangeRequest,
  type IdentityProfile,
  type PostalAddress,
} from '@/lib/gateway';

const REASONS: { value: AddressChangeRequest['reason']; label: string }[] = [
  { value: 'move', label: 'Physical move' },
  { value: 'correction', label: 'Correction of existing record' },
  { value: 'legal_name_change', label: 'Legal name change (marriage, etc.)' },
  { value: 'other', label: 'Other (note in description)' },
];

function isoDateToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ProfileForm({ profile }: { profile: IdentityProfile }) {
  const [address, setAddress] = useState<PostalAddress>(profile.address);
  const [reason, setReason] = useState<AddressChangeRequest['reason']>('move');
  const [effective, setEffective] = useState<string>(isoDateToday());
  const [busy, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function submit() {
    startTransition(async () => {
      setErr(null);
      setOk(null);
      try {
        await gateway.identity.changeAddress({
          address,
          reason,
          effectiveAt: new Date(`${effective}T00:00:00Z`).toISOString(),
        });
        setOk('Address change submitted. OFAC re-screen is running; we will email you if there is a flag.');
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
      className="flex flex-col gap-4"
      aria-label="Address change"
    >
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <div className="text-[1.1rem] uppercase tracking-[0.06em] text-[var(--color-muted)]">
            Current legal name
          </div>
          <div className="text-[1.4rem] font-medium">{profile.legalName}</div>
        </div>
        <div>
          <div className="text-[1.1rem] uppercase tracking-[0.06em] text-[var(--color-muted)]">
            Country of tax residence
          </div>
          <div className="text-[1.4rem] font-medium">
            {profile.countryOfTaxResidence}
          </div>
        </div>
      </div>

      <AddressFields value={address} onChange={setAddress} />

      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <Select
          label="Reason"
          name="reason"
          value={reason}
          options={REASONS}
          onChange={(e) =>
            setReason(e.target.value as AddressChangeRequest['reason'])
          }
        />
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Effective date
          <input
            type="date"
            value={effective}
            min={isoDateToday()}
            onChange={(e) => setEffective(e.target.value)}
            required
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
          />
        </label>
      </div>

      <Button type="submit" disabled={busy} className="self-start">
        Submit address change
      </Button>
      {err ? <Notice tone="error">{err}</Notice> : null}
      {ok ? <Notice tone="success">{ok}</Notice> : null}
    </form>
  );
}
