'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Sidebar is the authenticated-area navigation. The route list is a flat
// constant so any of the parallel G-22 agents adding pages (Stage 10.2 /
// 10.3 / 10.4 / etc.) can append their route here in one place.
//
// G-22a (this commit) owns: dashboard, activity.
// G-22b will add: documents, inbox, tax.
// G-22c will add: wallet, market, kyc, profile, beneficiary.
//
// Each new entry is one line. The Shell renders this Sidebar in the
// (authed) layout; routes that don't have a page yet 404 by design — that's
// the surface area the other agents fill in.

const NAV: { href: string; label: string; group: string }[] = [
  // foundation
  { href: '/dashboard', label: 'Dashboard', group: 'overview' },
  // G-22b
  { href: '/documents', label: 'Documents', group: 'records' },
  { href: '/inbox', label: 'Inbox', group: 'records' },
  { href: '/tax', label: 'Tax Documents', group: 'records' },
  // G-22c
  { href: '/wallet', label: 'Wallet', group: 'capital' },
  { href: '/market', label: 'Secondary Market', group: 'capital' },
  // G-22c (compliance)
  { href: '/kyc', label: 'KYC & Suitability', group: 'compliance' },
  { href: '/profile', label: 'Profile & Address', group: 'compliance' },
  { href: '/beneficiary', label: 'Beneficiary / TOD', group: 'compliance' },
  // G-22a
  { href: '/activity', label: 'Activity Log', group: 'audit' },
];

const GROUPS: { key: string; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'records', label: 'Records' },
  { key: 'capital', label: 'Capital' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'audit', label: 'Audit' },
];

export function Sidebar() {
  const path = usePathname() ?? '';
  return (
    <aside
      className="border-r border-[var(--color-border)] bg-[var(--color-background)] flex flex-col py-3 px-2 min-h-0"
      data-testid="investor-sidebar"
    >
      {GROUPS.map((g) => (
        <div key={g.key} className="mb-4">
          <div className="px-3 py-1 text-[1rem] tracking-[0.08em] uppercase text-[var(--color-muted)]">
            {g.label}
          </div>
          {NAV.filter((n) => n.group === g.key).map((n) => {
            const active = path === n.href || path.startsWith(n.href + '/');
            return (
              <Link
                key={n.href}
                href={n.href}
                className={[
                  'block px-3 py-2 rounded-lg text-[1.3rem] mt-px',
                  active
                    ? 'bg-[var(--color-surface)] text-[var(--color-foreground)]'
                    : 'text-[var(--color-secondary)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface)]',
                ].join(' ')}
              >
                {n.label}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
