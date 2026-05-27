import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrderEntryPanel } from '@/app/(authed)/market/OrderEntryPanel';
import { GateDecisionView } from '@/app/(authed)/market/GateDecisionView';
import {
  mockGateAllow,
  mockGateDeny,
  mockGateEscalate,
  mockOfferings,
  mockPlaceOrderAllow,
  mockPlaceOrderDeny,
  mockPlaceOrderEscalate,
} from '@/lib/gateway/fixtures';

const placeOrderMock = vi.fn();

vi.mock('@/lib/gateway', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/gateway')>();
  return {
    ...actual,
    gateway: {
      ...actual.gateway,
      market: {
        ...actual.gateway.market,
        placeOrder: (...args: unknown[]) => placeOrderMock(...args),
      },
    },
  };
});

describe('GateDecisionView', () => {
  it('renders an allow notice', () => {
    render(<GateDecisionView decision={mockGateAllow()} />);
    expect(screen.getByText(/Pre-trade compliance: cleared/)).toBeInTheDocument();
  });

  it('renders deny reasons and required actions', () => {
    render(<GateDecisionView decision={mockGateDeny()} />);
    expect(screen.getByText(/Pre-trade compliance: denied/)).toBeInTheDocument();
    expect(screen.getByText('accreditation_stale')).toBeInTheDocument();
    expect(screen.getByText('ofac_screen_stale')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Renew accreditation' }),
    ).toHaveAttribute('href', '/kyc#accreditation');
  });

  it('renders escalate as a warn notice with reasons', () => {
    render(<GateDecisionView decision={mockGateEscalate()} />);
    expect(
      screen.getByText(/Pre-trade compliance: held for review/),
    ).toBeInTheDocument();
    expect(screen.getByText('accreditation_near_expiry')).toBeInTheDocument();
  });
});

describe('OrderEntryPanel', () => {
  beforeEach(() => {
    placeOrderMock.mockReset();
  });

  function fillAndSubmit() {
    const [offering] = mockOfferings();
    render(<OrderEntryPanel offering={offering} />);
    fireEvent.change(screen.getByLabelText(/Quantity/), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Limit price/), {
      target: { value: '102.50' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Place BUY/ }));
  }

  it('renders an allow decision after a successful gate-cleared submit', async () => {
    placeOrderMock.mockResolvedValueOnce(mockPlaceOrderAllow());
    fillAndSubmit();
    await waitFor(() => {
      expect(screen.getByText(/Pre-trade compliance: cleared/)).toBeInTheDocument();
    });
    expect(placeOrderMock).toHaveBeenCalledOnce();
  });

  it('renders deny reasons after a gate-denied submit', async () => {
    placeOrderMock.mockResolvedValueOnce(mockPlaceOrderDeny());
    fillAndSubmit();
    await waitFor(() => {
      expect(screen.getByText(/Pre-trade compliance: denied/)).toBeInTheDocument();
    });
    expect(screen.getByText('accreditation_stale')).toBeInTheDocument();
  });

  it('renders an escalate notice after a gate-escalated submit', async () => {
    placeOrderMock.mockResolvedValueOnce(mockPlaceOrderEscalate());
    fillAndSubmit();
    await waitFor(() => {
      expect(
        screen.getByText(/Pre-trade compliance: held for review/),
      ).toBeInTheDocument();
    });
  });

  it('rejects a price that does not align to tick size client-side', () => {
    const [offering] = mockOfferings();
    render(<OrderEntryPanel offering={offering} />);
    fireEvent.change(screen.getByLabelText(/Quantity/), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Limit price/), {
      target: { value: '102.555' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Place BUY/ }));
    expect(
      screen.getByText(/Price must align to tick size/),
    ).toBeInTheDocument();
    expect(placeOrderMock).not.toHaveBeenCalled();
  });

  it('rejects a quantity that does not align to lot size client-side', () => {
    const [, offering2] = mockOfferings(); // URN.RN24 lot = 10
    render(<OrderEntryPanel offering={offering2} />);
    fireEvent.change(screen.getByLabelText(/Quantity/), { target: { value: '7' } });
    fireEvent.change(screen.getByLabelText(/Limit price/), {
      target: { value: '98.50' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Place BUY/ }));
    expect(screen.getByText(/Quantity must be a multiple of lot size/)).toBeInTheDocument();
    expect(placeOrderMock).not.toHaveBeenCalled();
  });
});
