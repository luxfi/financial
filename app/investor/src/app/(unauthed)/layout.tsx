import { LUX_BRAND } from '@luxbank/brand';

// (unauthed) routes render outside the Shell — no sidebar, no account menu.
// Sign-in / sign-out only.
export default function UnauthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 h-14 border-b border-[var(--color-border)] flex items-center">
        <div className="text-[1.6rem] font-bold tracking-tight">
          {LUX_BRAND.name} <span className="text-[1.1rem] uppercase tracking-[0.08em] text-[var(--color-muted)] ml-1">Investor</span>
        </div>
      </header>
      <main className="flex-1 grid place-items-center p-6">{children}</main>
      <footer className="px-6 h-7 border-t border-[var(--color-border)] flex items-center text-[1.1rem] text-[var(--color-muted)]">
        {LUX_BRAND.jurisdiction.legalEntity.name}
      </footer>
    </div>
  );
}
