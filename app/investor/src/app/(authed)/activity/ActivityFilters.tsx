'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/forms';

const CATEGORIES = [
  { value: '', label: 'All categories' },
  { value: 'auth', label: 'Auth' },
  { value: 'document', label: 'Document' },
  { value: 'trade', label: 'Trade' },
  { value: 'withdrawal', label: 'Withdrawal' },
  { value: 'profile', label: 'Profile' },
  { value: 'beneficiary', label: 'Beneficiary' },
  { value: 'kyc', label: 'KYC' },
  { value: 'comms', label: 'Communications' },
];

const OUTCOMES = [
  { value: '', label: 'Any outcome' },
  { value: 'success', label: 'Success' },
  { value: 'failure', label: 'Failure' },
  { value: 'denied', label: 'Denied' },
  { value: 'pending', label: 'Pending' },
];

export function ActivityFilters({
  category,
  outcome,
  since,
  until,
}: {
  category: string;
  outcome: string;
  since: string;
  until: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const replace = (k: string, v: string) => {
    const next = new URLSearchParams(params?.toString() ?? '');
    if (v) next.set(k, v);
    else next.delete(k);
    next.delete('cursor');
    router.push(`?${next.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <Select
        label="Category"
        name="category"
        value={category}
        options={CATEGORIES}
        onChange={(e) => replace('category', e.target.value)}
      />
      <Select
        label="Outcome"
        name="outcome"
        value={outcome}
        options={OUTCOMES}
        onChange={(e) => replace('outcome', e.target.value)}
      />
      <label
        htmlFor="since"
        className="flex items-center gap-2 text-[1.2rem] text-[var(--color-secondary)]"
      >
        Since
        <input
          id="since"
          type="date"
          value={since}
          onChange={(e) => replace('since', e.target.value)}
          className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
        />
      </label>
      <label
        htmlFor="until"
        className="flex items-center gap-2 text-[1.2rem] text-[var(--color-secondary)]"
      >
        Until
        <input
          id="until"
          type="date"
          value={until}
          onChange={(e) => replace('until', e.target.value)}
          className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem]"
        />
      </label>
    </div>
  );
}
