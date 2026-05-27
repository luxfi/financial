import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MethodsTable } from '@/app/(authed)/wallet/MethodsTable';
import { StablecoinPanel } from '@/app/(authed)/wallet/StablecoinPanel';
import { mockPaymentMethods } from '@/lib/gateway/fixtures';

// Mock the gateway so the buttons that trigger network calls do not
// actually go out. We only assert the render shape here; action paths
// are covered by separate tests that mock specific responses.
vi.mock('@/lib/gateway', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/gateway')>();
  return {
    ...actual,
    gateway: {
      ...actual.gateway,
      wallet: {
        ...actual.gateway.wallet,
        list: vi.fn(),
        add: vi.fn(),
        verify: vi.fn(),
        unlink: vi.fn(),
        setDefault: vi.fn(),
      },
    },
  };
});

describe('MethodsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders one row per fiat payment method with status + label', () => {
    const fiat = mockPaymentMethods().filter((m) => m.kind !== 'stablecoin');
    render(<MethodsTable initialMethods={fiat} />);
    expect(
      screen.getByRole('table', { name: 'Payment methods' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Chase ****1234')).toBeInTheDocument();
    expect(screen.getByText('Visa ****4242')).toBeInTheDocument();
    expect(screen.getByText('BofA ****9911')).toBeInTheDocument();
    expect(screen.getByText('Wire to Citi (settlement)')).toBeInTheDocument();
    expect(screen.getByText('Equity Trust IRA ****8732')).toBeInTheDocument();
  });

  it('marks the verified ACH default with both settlement and distributions', () => {
    const fiat = mockPaymentMethods().filter((m) => m.kind !== 'stablecoin');
    render(<MethodsTable initialMethods={fiat} />);
    expect(screen.getByText('Settlement · Distributions')).toBeInTheDocument();
  });

  it('surfaces Verify on a method pending micro-deposits', () => {
    const fiat = mockPaymentMethods().filter((m) => m.kind !== 'stablecoin');
    render(<MethodsTable initialMethods={fiat} />);
    const verifyButtons = screen.getAllByRole('button', { name: 'Verify' });
    expect(verifyButtons.length).toBe(1);
  });

  it('renders an empty state when no methods exist', () => {
    render(<MethodsTable initialMethods={[]} />);
    expect(
      screen.getByText('No fiat or custody payment methods linked yet.'),
    ).toBeInTheDocument();
  });
});

describe('StablecoinPanel', () => {
  it('renders the wallet table + the link form', () => {
    const sc = mockPaymentMethods().filter((m) => m.kind === 'stablecoin');
    render(<StablecoinPanel initialMethods={sc} />);
    expect(screen.getByText('Stablecoin wallets')).toBeInTheDocument();
    expect(screen.getByText('USDC')).toBeInTheDocument();
    // Address truncated for display (8-char prefix + ellipsis + 6-char suffix).
    expect(screen.getByText(/0xab12cd…90ef34/)).toBeInTheDocument();
    expect(
      screen.getByRole('form', { name: 'Link stablecoin wallet' }),
    ).toBeInTheDocument();
  });
});
