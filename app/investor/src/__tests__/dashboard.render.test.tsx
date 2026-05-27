import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PortfolioSummaryCard } from '@/app/(authed)/dashboard/PortfolioSummary';
import { PositionsTable } from '@/app/(authed)/dashboard/PositionsTable';
import { PendingSettlementsCard } from '@/app/(authed)/dashboard/PendingSettlements';
import type {
  PortfolioSummary,
  Position,
  PendingSettlement,
} from '@/lib/gateway';

const summary: PortfolioSummary = {
  totalNAV: '1250000',
  totalCostBasis: '1000000',
  totalUnrealizedPnL: '250000',
  currency: 'USD',
  deltas: { h24: '1500', d7: '-300', d30: '12000' },
  positionCount: 4,
  asOf: '2026-05-25',
};

const positions: Position[] = [
  {
    id: 'pos_1',
    investorID: 'inv',
    tenantID: 't',
    offeringID: 'off_1',
    offeringName: 'Lux Fund I',
    securityID: 'sec_1',
    securityClass: 'lp_units',
    quantity: '100',
    costBasis: '100000',
    nav: '125000',
    unrealizedPnL: '25000',
    currency: 'USD',
    lockupRemainingDays: 42,
    restrictionsLabel: 'Rule 144 lockup',
    lots: [],
    asOf: '2026-05-25',
  },
];

const settlements: PendingSettlement[] = [
  {
    tradeID: 'tr_1',
    side: 'buy',
    securityID: 'sec_2',
    securityName: 'Lux Series A',
    quantity: '50',
    price: '10',
    grossAmount: '500',
    currency: 'USD',
    bucket: 'T+1',
    expectedSettlementDate: '2026-05-26',
    status: 'pending_compliance_clearance',
  },
];

describe('PortfolioSummaryCard', () => {
  it('renders total NAV, cost basis context, and signed deltas', () => {
    render(<PortfolioSummaryCard summary={summary} />);
    expect(screen.getByText('Portfolio NAV')).toBeInTheDocument();
    expect(screen.getByText('Total NAV')).toBeInTheDocument();
    expect(screen.getByText('$1,250,000.00')).toBeInTheDocument();
    expect(screen.getByText(/4 positions/)).toBeInTheDocument();
    expect(screen.getByText(/cost basis \$1,000,000\.00/)).toBeInTheDocument();
    expect(screen.getByText('+$1,500.00')).toBeInTheDocument();
    expect(screen.getByText('-$300.00')).toBeInTheDocument();
  });
});

describe('PositionsTable', () => {
  it('renders each position with quantity, NAV and P&L', () => {
    render(<PositionsTable positions={positions} />);
    expect(screen.getByRole('table', { name: 'Positions' })).toBeInTheDocument();
    expect(screen.getByText('Lux Fund I')).toBeInTheDocument();
    expect(screen.getByText('lp_units')).toBeInTheDocument();
    expect(screen.getByText('$125,000.00')).toBeInTheDocument();
    expect(screen.getByText('+$25,000.00')).toBeInTheDocument();
    expect(screen.getByText('42d')).toBeInTheDocument();
    expect(screen.getByText('Rule 144 lockup')).toBeInTheDocument();
  });

  it('shows an empty-state row when there are no positions', () => {
    render(<PositionsTable positions={[]} />);
    expect(
      screen.getByText('You have no open positions.'),
    ).toBeInTheDocument();
  });
});

describe('PendingSettlementsCard', () => {
  it('renders bucket badges, side colour and trade amounts', () => {
    render(<PendingSettlementsCard settlements={settlements} />);
    expect(screen.getByText('Pending settlement')).toBeInTheDocument();
    expect(screen.getByText('T+1')).toBeInTheDocument();
    expect(screen.getByText('BUY')).toBeInTheDocument();
    expect(screen.getByText('Lux Series A')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
  });

  it('renders an empty-state when there are no settlements', () => {
    render(<PendingSettlementsCard settlements={[]} />);
    expect(screen.getByText('No pending settlements.')).toBeInTheDocument();
  });
});
