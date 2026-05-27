import { describe, it, expect } from 'vitest';
import {
  fmtCurrency,
  fmtPercent,
  fmtNumber,
  fmtDate,
  fmtDateTime,
  signClass,
} from '@/lib/format';

describe('fmtCurrency', () => {
  it('formats a numeric string as USD', () => {
    expect(fmtCurrency('1234.5')).toBe('$1,234.50');
  });
  it('returns em-dash for non-finite inputs', () => {
    expect(fmtCurrency('not-a-number')).toBe('—');
  });
});

describe('fmtPercent', () => {
  it('converts ratios to a percent', () => {
    expect(fmtPercent('0.1234', 2)).toBe('12.34%');
  });
});

describe('fmtNumber', () => {
  it('formats with thousands separators', () => {
    expect(fmtNumber(1000000)).toBe('1,000,000');
  });
});

describe('fmtDate / fmtDateTime', () => {
  it('returns the original string when not parseable', () => {
    expect(fmtDate('garbage')).toBe('garbage');
    expect(fmtDateTime('garbage')).toBe('garbage');
  });
});

describe('signClass', () => {
  it('maps signs to colour tokens', () => {
    expect(signClass('1.0')).toContain('success');
    expect(signClass('-1.0')).toContain('danger');
    expect(signClass('0')).toContain('muted');
    expect(signClass('NaN')).toContain('muted');
  });
});
