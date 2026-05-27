// Inbox page — server render with mocked comms data.

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('@/lib/gateway/comms', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/gateway/comms')>(
      '@/lib/gateway/comms',
    );
  const ROWS = [
    {
      id: 'notice_dividend_q1',
      type: 'dividend' as const,
      subject: 'Acme Q1 dividend declared',
      issuedBy: 'Acme Corp',
      issuedAt: '2025-04-01T00:00:00Z',
      readAt: null,
      actionRequired: false,
    },
    {
      id: 'notice_proxy_2025',
      type: 'proxy' as const,
      subject: '2025 Annual Meeting Proxy',
      issuedBy: 'Acme Corp',
      issuedAt: '2025-05-10T00:00:00Z',
      readAt: null,
      actionRequired: true,
    },
    {
      id: 'notice_kyc_refresh',
      type: 'kyc_refresh' as const,
      subject: 'KYC renewal required',
      issuedBy: 'Lux Transfer',
      issuedAt: '2025-04-20T00:00:00Z',
      readAt: '2025-04-21T00:00:00Z',
      actionRequired: true,
    },
  ];
  const UNREAD = {
    total: 2,
    byType: {
      regulatory: 0,
      dividend: 1,
      proxy: 1,
      corp_action: 0,
      distribution: 0,
      kyc_refresh: 0,
      general: 0,
    },
    latestAt: '2025-05-10T00:00:00Z',
  };
  return {
    ...actual,
    comms: {
      list: vi.fn().mockResolvedValue(ROWS),
      unread: vi.fn().mockResolvedValue(UNREAD),
      get: vi.fn().mockResolvedValue({
        ...ROWS[0],
        bodyHtml: '<p>Q1 dividend of $1.50 per share declared.</p>',
      }),
      markRead: vi.fn().mockResolvedValue({
        ...UNREAD,
        total: 1,
        byType: { ...UNREAD.byType, dividend: 0 },
      }),
      acknowledge: vi.fn(),
    },
  };
});

import InboxPage from '@/app/(authed)/inbox/page';

describe('InboxPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the notice list grouped by type', async () => {
    const page = await InboxPage();
    render(page as React.ReactElement);

    expect(
      screen.getByRole('heading', { name: 'Inbox' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Acme Q1 dividend declared')).toBeInTheDocument();
    expect(screen.getByText('2025 Annual Meeting Proxy')).toBeInTheDocument();
    expect(screen.getByText('KYC renewal required')).toBeInTheDocument();

    // Unread-only checkbox shows the unread count from the unread() call.
    expect(screen.getByText(/Unread only \(2\)/)).toBeInTheDocument();

    // First selected notice's body renders on detail panel after effect.
    await waitFor(() => {
      const body = screen.getByTestId('notice-body');
      expect(body.textContent).toMatch(/Q1 dividend of \$1\.50/);
    });
  });
});
