// 8949 CSV serialiser — golden output + escaping rules.

import { describe, it, expect } from 'vitest';
import {
  costBasisToCsv8949,
  type CostBasisReport,
} from '@/lib/gateway/tax';

const HEADER =
  'Description,Date acquired,Date sold,Proceeds,Cost basis,Gain or loss,Term,Wash sale';

describe('costBasisToCsv8949', () => {
  it('emits header only for an empty report', () => {
    const report: CostBasisReport = {
      taxYear: 2025,
      method: 'fifo',
      lines: [],
      totalProceeds: '0',
      totalCostBasis: '0',
      shortTermGainLoss: '0',
      longTermGainLoss: '0',
      currency: 'USD',
    };
    expect(costBasisToCsv8949(report)).toBe(HEADER);
  });

  it('excludes open lots (no proceeds / no date sold)', () => {
    const report: CostBasisReport = {
      taxYear: 2025,
      method: 'fifo',
      lines: [
        {
          lotID: 'lot1',
          securityID: 'sec1',
          securityName: 'Acme Series A',
          acquiredDate: '2024-01-15',
          dateSold: null,
          quantity: '100',
          costPerShare: '10',
          totalCostBasis: '1000',
          proceeds: null,
          realizedGainLoss: null,
          term: null,
          washSale: false,
        },
      ],
      totalProceeds: '0',
      totalCostBasis: '1000',
      shortTermGainLoss: '0',
      longTermGainLoss: '0',
      currency: 'USD',
    };
    expect(costBasisToCsv8949(report)).toBe(HEADER);
  });

  it('serialises a closed lot with quoted description', () => {
    const report: CostBasisReport = {
      taxYear: 2025,
      method: 'lifo',
      lines: [
        {
          lotID: 'lot2',
          securityID: 'sec2',
          securityName: 'Acme, Inc. Series B',
          acquiredDate: '2024-03-10',
          dateSold: '2025-04-12',
          quantity: '50',
          costPerShare: '20',
          totalCostBasis: '1000',
          proceeds: '1500',
          realizedGainLoss: '500',
          term: 'long',
          washSale: false,
        },
      ],
      totalProceeds: '1500',
      totalCostBasis: '1000',
      shortTermGainLoss: '0',
      longTermGainLoss: '500',
      currency: 'USD',
    };
    const csv = costBasisToCsv8949(report);
    const [header, row] = csv.split('\n');
    expect(header).toBe(HEADER);
    expect(row).toBe(
      '"Acme, Inc. Series B (50)",2024-03-10,2025-04-12,1500,1000,500,long,N',
    );
  });

  it('marks wash sales correctly', () => {
    const report: CostBasisReport = {
      taxYear: 2025,
      method: 'specific',
      lines: [
        {
          lotID: 'lot3',
          securityID: 'sec3',
          securityName: 'Beta',
          acquiredDate: '2024-12-01',
          dateSold: '2025-02-15',
          quantity: '10',
          costPerShare: '100',
          totalCostBasis: '1000',
          proceeds: '900',
          realizedGainLoss: '-100',
          term: 'short',
          washSale: true,
        },
      ],
      totalProceeds: '900',
      totalCostBasis: '1000',
      shortTermGainLoss: '-100',
      longTermGainLoss: '0',
      currency: 'USD',
    };
    const csv = costBasisToCsv8949(report);
    expect(csv).toMatch(/,short,Y$/);
  });

  it('escapes embedded double quotes', () => {
    const report: CostBasisReport = {
      taxYear: 2025,
      method: 'fifo',
      lines: [
        {
          lotID: 'lot4',
          securityID: 'sec4',
          securityName: 'Quote "Special" Co.',
          acquiredDate: '2024-06-01',
          dateSold: '2025-07-01',
          quantity: '1',
          costPerShare: '1',
          totalCostBasis: '1',
          proceeds: '2',
          realizedGainLoss: '1',
          term: 'long',
          washSale: false,
        },
      ],
      totalProceeds: '2',
      totalCostBasis: '1',
      shortTermGainLoss: '0',
      longTermGainLoss: '1',
      currency: 'USD',
    };
    const csv = costBasisToCsv8949(report);
    expect(csv).toContain('"Quote ""Special"" Co. (1)"');
  });
});
