import { describe, it, expect } from 'vitest';
import {
  CSV_HEADER,
  formatEntryForCSV,
  type AuditEntry,
} from '@/lib/gateway';

describe('formatEntryForCSV', () => {
  it('serializes an entry with comma + quote escaping', () => {
    const e: AuditEntry = {
      id: 'a1',
      ts: '2026-05-25T12:34:56Z',
      investorID: 'inv_1',
      tenantID: 't',
      category: 'document',
      action: 'document.view',
      target: 'doc_42',
      description: 'opened "K-1, 2025"',
      ip: '203.0.113.1',
      userAgent: 'Mozilla/5.0',
      outcome: 'success',
    };
    const row = formatEntryForCSV(e);
    expect(row).toContain('"2026-05-25T12:34:56Z"');
    expect(row).toContain('"document.view"');
    expect(row).toContain('"opened ""K-1, 2025"""');
    expect(row).toContain('"success"');
    // Quoted field with an embedded comma should still represent 9 logical
    // columns. We count by stepping through the row and tracking quote state.
    expect(countCsvColumns(row)).toBe(9);
  });

  function countCsvColumns(row: string): number {
    let inQuotes = false;
    let cols = 1;
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '"') {
        // doubled quote inside a quoted field == escaped quote
        if (inQuotes && row[i + 1] === '"') {
          i++;
          continue;
        }
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        cols++;
      }
    }
    return cols;
  }

  it('handles missing optional fields', () => {
    const e: AuditEntry = {
      id: 'a2',
      ts: '2026-05-25T00:00:00Z',
      investorID: '',
      tenantID: '',
      category: 'auth',
      action: 'login',
      target: '',
      description: '',
      ip: '',
      userAgent: '',
      outcome: 'success',
    };
    const row = formatEntryForCSV(e);
    expect(row).toMatch(/""$/);
  });

  it('CSV_HEADER lists all 9 columns', () => {
    expect(CSV_HEADER.split(',').length).toBe(9);
  });
});
