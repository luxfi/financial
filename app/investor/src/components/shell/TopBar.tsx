'use client';

import Link from 'next/link';
import { useState } from 'react';

export interface TopBarProps {
  brandName: string;
  investorName: string;
  investorEmail: string;
  signOutHref: string;
}

export function TopBar({
  brandName,
  investorName,
  investorEmail,
  signOutHref,
}: TopBarProps) {
  const [open, setOpen] = useState(false);
  const initial = (investorName || investorEmail || '?').slice(0, 1).toUpperCase();
  return (
    <header className="grid items-center grid-cols-[240px_1fr_auto] px-4 border-b border-[var(--color-border)] h-14">
      <div className="flex items-baseline gap-2">
        <Link
          href="/dashboard"
          className="text-[1.6rem] font-bold tracking-tight"
        >
          {brandName}
        </Link>
        <span className="text-[1.1rem] uppercase tracking-[0.08em] text-[var(--color-muted)]">
          Investor
        </span>
      </div>
      <nav className="flex gap-4 text-[1.3rem] text-[var(--color-secondary)]">
        <Link href="/dashboard" className="hover:text-[var(--color-foreground)]">
          Overview
        </Link>
        <Link href="/activity" className="hover:text-[var(--color-foreground)]">
          Activity
        </Link>
      </nav>
      <div className="relative">
        <button
          aria-label="Account menu"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[1.2rem] hover:border-[var(--color-border-hover)]"
        >
          {initial}
        </button>
        {open ? (
          <div
            role="menu"
            className="absolute right-0 mt-2 w-64 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-3 z-10 shadow-2xl"
          >
            <div className="text-[1.3rem] font-medium">{investorName || '—'}</div>
            <div className="text-[1.2rem] text-[var(--color-muted)] mb-3">
              {investorEmail || '—'}
            </div>
            <Link
              href="/profile"
              className="block py-2 text-[1.3rem] hover:text-[var(--color-foreground)] text-[var(--color-secondary)]"
            >
              Profile
            </Link>
            <a
              href={signOutHref}
              className="block py-2 text-[1.3rem] hover:text-[var(--color-danger)] text-[var(--color-secondary)]"
            >
              Sign out
            </a>
          </div>
        ) : null}
      </div>
    </header>
  );
}
