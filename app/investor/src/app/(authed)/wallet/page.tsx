// Wallet / payment-method management — Stage 10.4.
//
// Server component. Reads the investor's full payment-method list through
// the gateway (which fronts treasury/pkg/provider/* — plaid + stripe +
// moderntreasury + northcapital + bridge + lux/mpc), surfaces them in a
// single table, and provides "Add method" + per-row action affordances.
//
// Source-of-design: Lux-Prior-IP
// Source-ref: treasury/pkg/provider (provider.go, plaid/, stripe/,
//   moderntreasury/, northcapital/, bridge/) — every payment rail.
//
// Per-row actions (verify / set-default / unlink) are wired through
// `MethodsTable` (client component) so the network round-trip happens
// in-browser; the server only delivers the initial snapshot.

import { Card, Notice, PageHeader } from '@/components/data';
import { gateway, type PaymentMethod } from '@/lib/gateway';
import { AddMethodPanel } from './AddMethodPanel';
import { MethodsTable } from './MethodsTable';
import { StablecoinPanel } from './StablecoinPanel';

export const dynamic = 'force-dynamic';

export default async function WalletPage() {
  let methods: PaymentMethod[] = [];
  let error: string | null = null;
  try {
    methods = await gateway.wallet.list();
  } catch (err) {
    error = (err as Error).message;
  }

  const fiat = methods.filter((m) => m.kind !== 'stablecoin');
  const stablecoin = methods.filter((m) => m.kind === 'stablecoin');

  return (
    <>
      <PageHeader
        title="Wallet & Payment Methods"
        subtitle="Linked bank accounts, cards, wire instructions, IRA custody accounts, and on-chain wallets. Set defaults for settlement and distributions; verify micro-deposits; unlink anything you no longer use."
      />

      {error ? (
        <div className="mb-4">
          <Notice tone="error">Failed to load payment methods: {error}</Notice>
        </div>
      ) : null}

      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <Card title="Payment methods" subtitle="ACH, card, wire, IRA custody">
          <MethodsTable initialMethods={fiat} />
        </Card>
        <AddMethodPanel />
      </div>

      <div className="mt-6">
        <StablecoinPanel initialMethods={stablecoin} />
      </div>
    </>
  );
}
