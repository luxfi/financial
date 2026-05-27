// WORM SHA-256 verification — golden vectors + tamper-detect.
//
// The canonical Go side computes SHA-256 of the raw bytes; our browser
// helper must produce the same hex digest for the same input.

import { describe, it, expect } from 'vitest';
import { sha256Hex, verifySha256, IntegrityError } from '@/lib/worm/sha256';

const enc = new TextEncoder();

describe('worm sha256', () => {
  it('matches the NIST empty-string golden vector', async () => {
    const digest = await sha256Hex(new Uint8Array());
    expect(digest).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });

  it('matches the "abc" golden vector', async () => {
    const digest = await sha256Hex(enc.encode('abc'));
    expect(digest).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  it('verifies a matching hash', async () => {
    const body = enc.encode('hello worm');
    const expected = await sha256Hex(body);
    await expect(verifySha256(body, expected)).resolves.toBe(expected);
  });

  it('throws IntegrityError on hash mismatch', async () => {
    const body = enc.encode('hello worm');
    await expect(
      verifySha256(body, '0'.repeat(64)),
    ).rejects.toBeInstanceOf(IntegrityError);
  });

  it('is case-insensitive on hex compare', async () => {
    const body = enc.encode('Lux');
    const digest = await sha256Hex(body);
    await expect(verifySha256(body, digest.toUpperCase())).resolves.toBe(
      digest,
    );
  });
});
