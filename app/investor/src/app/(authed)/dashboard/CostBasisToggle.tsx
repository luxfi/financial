'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/forms';

const METHODS = [
  { value: 'fifo', label: 'FIFO' },
  { value: 'lifo', label: 'LIFO' },
  { value: 'specific', label: 'Specific lot' },
];

// CostBasisToggle is the only client component on the dashboard page. It
// rewrites the URL query string so the server component re-fetches with the
// new cost-basis method.
export function CostBasisToggle({ value }: { value: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const v = METHODS.some((m) => m.value === value) ? value : 'fifo';
  return (
    <Select
      label="Cost basis"
      name="method"
      value={v}
      options={METHODS}
      onChange={(e) => {
        const next = new URLSearchParams(params?.toString() ?? '');
        next.set('method', e.target.value);
        router.push(`?${next.toString()}`);
      }}
    />
  );
}
