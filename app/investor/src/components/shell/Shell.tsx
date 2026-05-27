import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export interface ShellProps {
  brandName: string;
  brandLegalEntity: string;
  investorName: string;
  investorEmail: string;
  signOutHref: string;
  children: ReactNode;
}

// Shell is the authenticated app frame. The signin / signout pages render
// outside this — they have no sidebar or account menu.
export function Shell(props: ShellProps) {
  return (
    <div
      className="min-h-screen grid bg-[var(--color-background)]"
      style={{ gridTemplateRows: '56px 1fr 28px' }}
    >
      <TopBar
        brandName={props.brandName}
        investorName={props.investorName}
        investorEmail={props.investorEmail}
        signOutHref={props.signOutHref}
      />
      <div className="grid min-h-0" style={{ gridTemplateColumns: '240px 1fr' }}>
        <Sidebar />
        <main className="p-6 overflow-auto">{props.children}</main>
      </div>
      <footer className="flex gap-2 items-center px-4 border-t border-[var(--color-border)] text-[1.1rem] text-[var(--color-muted)]">
        <span>{props.brandLegalEntity}</span>
        <span>·</span>
        <span>Encrypted session</span>
        <span>·</span>
        <span>Investor portal</span>
      </footer>
    </div>
  );
}
