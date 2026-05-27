'use client';

// Reusable PostalAddress form block. Used by the KYC refresh form and
// the address-change form on /profile. Single source of truth for
// field-level validation so both surfaces stay in sync.

import type { PostalAddress } from '@/lib/gateway';

export function AddressFields({
  value,
  onChange,
  legend = 'Address',
}: {
  value: PostalAddress;
  onChange: (next: PostalAddress) => void;
  legend?: string;
}) {
  function set<K extends keyof PostalAddress>(k: K, v: PostalAddress[K]) {
    onChange({ ...value, [k]: v });
  }

  return (
    <fieldset className="grid gap-3" aria-label={legend}>
      <legend className="text-[1.2rem] text-[var(--color-secondary)]">
        {legend}
      </legend>
      <label className="flex flex-col gap-1 text-[1.2rem]">
        Line 1
        <input
          value={value.line1}
          onChange={(e) => set('line1', e.target.value)}
          required
          className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
        />
      </label>
      <label className="flex flex-col gap-1 text-[1.2rem]">
        Line 2 (optional)
        <input
          value={value.line2 ?? ''}
          onChange={(e) => set('line2', e.target.value)}
          className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
        />
      </label>
      <div className="grid gap-3" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          City
          <input
            value={value.city}
            onChange={(e) => set('city', e.target.value)}
            required
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          State / region
          <input
            value={value.state}
            onChange={(e) => set('state', e.target.value)}
            required
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Postal code
          <input
            value={value.postalCode}
            onChange={(e) => set('postalCode', e.target.value)}
            required
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
          />
        </label>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Country (ISO)
          <input
            value={value.country}
            onChange={(e) => set('country', e.target.value.toUpperCase())}
            required
            pattern="^[A-Z]{2}$"
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
          />
        </label>
      </div>
    </fieldset>
  );
}
