import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readSessionFromHeaders, SessionError } from '@/lib/auth/session';

describe('readSessionFromHeaders', () => {
  it('returns null when identity headers are missing', () => {
    expect(readSessionFromHeaders(new Headers())).toBeNull();
  });

  it('returns a session when all three required headers are present', () => {
    const h = new Headers({
      'x-lux-sub': 'sub_123',
      'x-lux-investor-id': 'inv_42',
      'x-lux-tenant-id': 't_lux',
      'x-lux-email': 'investor@example.com',
      'x-lux-name': 'Ada Lovelace',
      'x-lux-exp': '1893456000',
    });
    const s = readSessionFromHeaders(h);
    expect(s).toEqual({
      sub: 'sub_123',
      investorID: 'inv_42',
      tenantID: 't_lux',
      email: 'investor@example.com',
      name: 'Ada Lovelace',
      exp: 1893456000,
    });
  });

  it('treats a non-numeric exp as 0', () => {
    const h = new Headers({
      'x-lux-sub': 's',
      'x-lux-investor-id': 'i',
      'x-lux-tenant-id': 't',
      'x-lux-exp': 'not-a-number',
    });
    expect(readSessionFromHeaders(h)?.exp).toBe(0);
  });

  it('returns null if any required header is empty', () => {
    const h = new Headers({
      'x-lux-sub': '',
      'x-lux-investor-id': 'i',
      'x-lux-tenant-id': 't',
    });
    expect(readSessionFromHeaders(h)).toBeNull();
  });

  it('also accepts a plain object', () => {
    const s = readSessionFromHeaders({
      'x-lux-sub': 'sub_xyz',
      'x-lux-investor-id': 'inv_xyz',
      'x-lux-tenant-id': 't_xyz',
    });
    expect(s?.investorID).toBe('inv_xyz');
  });
});

describe('SessionError', () => {
  it('has a stable name', () => {
    const e = new SessionError('bad token');
    expect(e.name).toBe('SessionError');
    expect(e.message).toBe('bad token');
  });
});
