'use client';

// Stablecoin wallet linkage — Stage 10.4.
//
// Two custody modes:
//   - Self-custody via WalletConnect: investor signs an ownership
//     challenge with their wallet (proves control of the address).
//   - Custodial via Lux MPC: the operator's MPC service holds a share;
//     the investor's signing key is one share of an (n, t) threshold.
//
// Each linked wallet can be marked as the default for distributions —
// the operator routes asset-class-appropriate distributions to the
// stablecoin instead of the ACH default when so flagged.

import { useState, useTransition } from 'react';
import { Button, Select } from '@/components/forms';
import { Card, DataTable, Notice } from '@/components/data';
import type { Column } from '@/components/data';
import { gateway, type PaymentMethod } from '@/lib/gateway';
import { fmtDateTime } from '@/lib/format';

const STATUS_LABEL: Record<PaymentMethod['status'], string> = {
  unverified: 'Pending signature',
  pending_micro_deposits: 'Pending',
  verified: 'Verified',
  failed: 'Failed',
  closed: 'Closed',
};

function truncateAddress(addr: string | undefined): string {
  if (!addr) return '—';
  if (addr.length <= 14) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export function StablecoinPanel({
  initialMethods,
}: {
  initialMethods: PaymentMethod[];
}) {
  const [methods, setMethods] = useState(initialMethods);
  const [protocol, setProtocol] = useState<'walletconnect' | 'luxmpc'>('walletconnect');
  const [chain, setChain] = useState('lux');
  const [address, setAddress] = useState('');
  const [busy, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function add() {
    if (!address) {
      setErr('Address is required.');
      return;
    }
    startTransition(async () => {
      setErr(null);
      setOk(null);
      try {
        // The browser would have already signed the ownership challenge
        // via WalletConnect or the MPC SDK; this submission carries the
        // signature + signed message. In the mock mode the gateway
        // accepts a synthesised challenge for testing.
        const created = await gateway.wallet.add(
          {
            kind: 'stablecoin',
            payload: {
              walletProtocol: protocol,
              address,
              chain,
              signature: 'mock-signature',
              signedMessage: `link-${address}-${Date.now()}`,
            },
          },
          `add-stablecoin-${address}-${Date.now()}`,
        );
        setMethods((prev) => [...prev, created]);
        setOk(`Linked ${created.label}.`);
        setAddress('');
      } catch (e) {
        setErr((e as Error).message);
      }
    });
  }

  function toggleDistDefault(id: string) {
    startTransition(async () => {
      setErr(null);
      setOk(null);
      try {
        const updated = await gateway.wallet.setDefault(id, 'distributions');
        setMethods((prev) =>
          prev.map((m) =>
            m.id === id
              ? updated
              : { ...m, defaultForDistributions: false },
          ),
        );
        setOk(`${updated.label} will now receive distributions.`);
      } catch (e) {
        setErr((e as Error).message);
      }
    });
  }

  function unlink(id: string, label: string) {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`Unlink ${label}? You can re-link the same address later.`)
    ) {
      return;
    }
    startTransition(async () => {
      setErr(null);
      setOk(null);
      try {
        await gateway.wallet.unlink(id);
        setMethods((prev) => prev.filter((m) => m.id !== id));
        setOk(`Unlinked ${label}.`);
      } catch (e) {
        setErr((e as Error).message);
      }
    });
  }

  const cols: Column<PaymentMethod>[] = [
    { key: 'asset', header: 'Asset', render: (m) => m.currency },
    {
      key: 'addr',
      header: 'Address',
      render: (m) => (
        <span className="font-mono text-[1.2rem]">
          {truncateAddress(m.onChainAddress)}
        </span>
      ),
    },
    { key: 'protocol', header: 'Custody', render: (m) => m.provider },
    {
      key: 'status',
      header: 'Status',
      render: (m) => STATUS_LABEL[m.status],
    },
    {
      key: 'dist',
      header: 'Default for distributions',
      align: 'center',
      render: (m) =>
        m.defaultForDistributions ? (
          <span className="text-[var(--color-success)]">Yes</span>
        ) : (
          <Button
            variant="ghost"
            disabled={busy || m.status !== 'verified'}
            onClick={() => toggleDistDefault(m.id)}
          >
            Make default
          </Button>
        ),
    },
    {
      key: 'lastUsed',
      header: 'Last used',
      render: (m) =>
        m.lastUsedAt ? (
          fmtDateTime(m.lastUsedAt)
        ) : (
          <span className="text-[var(--color-muted)]">Never</span>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (m) => (
        <Button variant="danger" disabled={busy} onClick={() => unlink(m.id, m.label)}>
          Unlink
        </Button>
      ),
    },
  ];

  return (
    <Card title="Stablecoin wallets" subtitle="USDC, USDT, PYUSD — self-custody or Lux MPC">
      <DataTable
        ariaLabel="Stablecoin wallets"
        rows={methods}
        rowKey={(m) => m.id}
        columns={cols}
        empty="No stablecoin wallets linked yet."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
        className="mt-4 p-4 border border-[var(--color-border)] rounded-xl grid gap-3"
        aria-label="Link stablecoin wallet"
        style={{ gridTemplateColumns: '1fr 1fr 2fr auto' }}
      >
        <Select
          label="Custody"
          name="walletProtocol"
          value={protocol}
          options={[
            { value: 'walletconnect', label: 'WalletConnect (self-custody)' },
            { value: 'luxmpc', label: 'Lux MPC (custodial)' },
          ]}
          onChange={(e) => setProtocol(e.target.value as 'walletconnect' | 'luxmpc')}
        />
        <Select
          label="Chain"
          name="chain"
          value={chain}
          options={[
            { value: 'lux', label: 'Lux' },
            { value: 'ethereum', label: 'Ethereum' },
            { value: 'base', label: 'Base' },
            { value: 'polygon', label: 'Polygon' },
            { value: 'arbitrum', label: 'Arbitrum' },
          ]}
          onChange={(e) => setChain(e.target.value)}
        />
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Address
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            pattern="^0x[0-9a-fA-F]{40}$"
            placeholder="0x…"
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem] font-mono"
          />
        </label>
        <Button type="submit" disabled={busy} className="self-end">
          Link
        </Button>
      </form>

      {ok ? (
        <div className="mt-3">
          <Notice tone="success">{ok}</Notice>
        </div>
      ) : null}
      {err ? (
        <div className="mt-3">
          <Notice tone="error">{err}</Notice>
        </div>
      ) : null}
    </Card>
  );
}
