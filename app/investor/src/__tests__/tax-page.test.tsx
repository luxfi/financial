// Tax page — server render with mocked 1099 + K-1 data + cost-basis report.

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('@/lib/gateway/tax', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/gateway/tax')>(
      '@/lib/gateway/tax',
    );
  const FOLDER = {
    taxYear: 2024,
    formCount: 3,
    totalOrdinaryIncome: '1450.00',
    totalCapitalGain: '6320.00',
    currency: 'USD',
    forms: [
      {
        id: 'form_1099div_2024_1',
        taxYear: 2024,
        formType: '1099-DIV' as const,
        payerName: 'Acme Corp',
        recipientTinLast4: '1234',
        status: 'generated' as const,
        generatedAt: '2025-01-31T00:00:00Z',
        sizeBytes: 18_000,
        sha256:
          'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      },
      {
        id: 'form_1099b_2024_1',
        taxYear: 2024,
        formType: '1099-B' as const,
        payerName: 'Lux Transfer',
        recipientTinLast4: '1234',
        status: 'filed' as const,
        generatedAt: '2025-01-31T00:00:00Z',
        sizeBytes: 22_400,
        sha256:
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
      {
        id: 'form_k1_2024_1',
        taxYear: 2024,
        formType: 'K-1' as const,
        payerName: 'Acme Fund LP',
        recipientTinLast4: '1234',
        status: 'generated' as const,
        generatedAt: '2025-03-15T00:00:00Z',
        sizeBytes: 40_960,
        sha256:
          '47dc540c94ceb704a23875c11273e16bb0b8a87aed84de911f2133568115f254',
      },
    ],
  };
  const REPORT = {
    taxYear: 2024,
    method: 'fifo' as const,
    currency: 'USD',
    totalProceeds: '15000',
    totalCostBasis: '8680',
    shortTermGainLoss: '0',
    longTermGainLoss: '6320',
    lines: [
      {
        lotID: 'lot1',
        securityID: 'sec1',
        securityName: 'Acme Series A',
        acquiredDate: '2022-06-01',
        dateSold: '2024-07-15',
        quantity: '500',
        costPerShare: '8.68',
        totalCostBasis: '4340',
        proceeds: '7500',
        realizedGainLoss: '3160',
        term: 'long' as const,
        washSale: false,
      },
      {
        lotID: 'lot2',
        securityID: 'sec1',
        securityName: 'Acme Series A',
        acquiredDate: '2023-09-01',
        dateSold: '2024-09-10',
        quantity: '500',
        costPerShare: '8.68',
        totalCostBasis: '4340',
        proceeds: '7500',
        realizedGainLoss: '3160',
        term: 'long' as const,
        washSale: false,
      },
    ],
  };
  return {
    ...actual,
    tax: {
      listYears: vi.fn().mockResolvedValue([2024, 2023]),
      folder: vi.fn().mockResolvedValue(FOLDER),
      formBody: vi.fn(),
      costBasis: vi.fn().mockResolvedValue(REPORT),
      costBasisCsv: vi.fn(),
      sendToCpa: vi.fn(),
    },
  };
});

import TaxPage from '@/app/(authed)/tax/page';

describe('TaxPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders 1099 + K-1 folder and cost-basis report', async () => {
    const page = await TaxPage();
    render(page as React.ReactElement);

    expect(
      screen.getByRole('heading', { name: 'Tax Documents' }),
    ).toBeInTheDocument();

    // Year tabs present.
    expect(screen.getByRole('tab', { name: '2024' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '2023' })).toBeInTheDocument();

    // Folder loads asynchronously inside the client component.
    await waitFor(() => {
      expect(
        screen.getByText('1099-DIV — Dividends'),
      ).toBeInTheDocument();
    });
    expect(screen.getByText('1099-B — Broker proceeds')).toBeInTheDocument();
    expect(screen.getByText('Schedule K-1 — Partner share')).toBeInTheDocument();

    // Method tabs present (fifo / lifo / specific).
    expect(screen.getByRole('tab', { name: 'fifo' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'lifo' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'specific' })).toBeInTheDocument();

    // Cost basis lines render.
    await waitFor(() => {
      expect(screen.getAllByText('Acme Series A').length).toBeGreaterThan(0);
    });

    // 8949 export button rendered.
    expect(
      screen.getByRole('button', { name: /Export 8949 CSV/ }),
    ).toBeInTheDocument();
  });
});
