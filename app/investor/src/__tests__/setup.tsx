// Vitest setup. Loaded once per worker. Wires testing-library matchers
// and stubs the next/headers + next/navigation surfaces so server-side
// components render under happy-dom without a full Next runtime.

import '@testing-library/jest-dom/vitest';
import * as React from 'react';
import { vi } from 'vitest';

// next/headers returns a server-side Headers object the gateway transport
// reads to forward identity. In tests we stub a stable investor/tenant.
vi.mock('next/headers', () => ({
  headers: async () => {
    const h = new Headers();
    h.set('x-lux-investor-id', 'inv_test_001');
    h.set('x-lux-tenant-id', 'tenant_test_001');
    h.set('x-lux-sub', 'sub_test_001');
    h.set('x-lux-email', 'investor@test.lux.financial');
    h.set('x-lux-name', 'Test Investor');
    h.set('x-lux-exp', String(Math.floor(Date.now() / 1000) + 3600));
    return h;
  },
  cookies: async () => ({
    get: (_name: string) => ({ value: 'test-cookie' }),
    has: (_name: string) => true,
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}));

// next/link → render a plain anchor so RTL can query by role.
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
