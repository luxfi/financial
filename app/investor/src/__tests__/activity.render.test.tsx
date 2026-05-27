import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuditTimeline } from '@/app/(authed)/activity/AuditTimeline';
import type { AuditEntry } from '@/lib/gateway';

const entries: AuditEntry[] = [
  {
    id: 'a1',
    ts: '2026-05-25T15:01:00Z',
    investorID: 'inv',
    tenantID: 't',
    category: 'auth',
    action: 'login',
    target: '',
    description: 'OIDC sign-in via Hanzo IAM',
    ip: '203.0.113.5',
    userAgent: 'Mozilla/5.0 Chrome/125',
    outcome: 'success',
  },
  {
    id: 'a2',
    ts: '2026-05-25T15:02:30Z',
    investorID: 'inv',
    tenantID: 't',
    category: 'trade',
    action: 'trade.place',
    target: 'tr_99',
    description: 'BUY 25 LUX-FUND-I @ 10.00',
    ip: '203.0.113.5',
    userAgent: 'Mozilla/5.0 Chrome/125',
    outcome: 'pending',
  },
  {
    id: 'a3',
    ts: '2026-05-25T15:05:10Z',
    investorID: 'inv',
    tenantID: 't',
    category: 'withdrawal',
    action: 'withdrawal.request',
    target: 'wd_7',
    description: 'Wire $1,000 to recipient_4',
    ip: '203.0.113.5',
    userAgent: 'Mozilla/5.0 Chrome/125',
    outcome: 'denied',
    err: 'OFAC screening failed',
  },
];

describe('AuditTimeline', () => {
  it('renders one row per entry with action + outcome + target', () => {
    render(<AuditTimeline entries={entries} />);
    expect(screen.getByTestId('audit-timeline')).toBeInTheDocument();
    expect(screen.getByText('login')).toBeInTheDocument();
    expect(screen.getByText('trade.place')).toBeInTheDocument();
    expect(screen.getByText('withdrawal.request')).toBeInTheDocument();
    expect(screen.getByText('→ tr_99')).toBeInTheDocument();
    expect(screen.getByText('OFAC screening failed')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('denied')).toBeInTheDocument();
    // 3 distinct success/pending/denied outcome tags rendered once each
    expect(screen.getAllByText(/success|pending|denied/i).length).toBeGreaterThanOrEqual(3);
  });

  it('renders the empty state when there are no entries', () => {
    render(<AuditTimeline entries={[]} />);
    expect(
      screen.getByText(/No matching activity in the selected range\./),
    ).toBeInTheDocument();
  });
});
