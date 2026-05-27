// SHA-256 verification for WORM-stored objects. Every Get from the document
// vault re-hashes the body and compares to the manifest hash returned by the
// gateway. The WORM AuditLog on the back-end captures both the read event
// and (on mismatch) the integrity-violation alert.
//
// Implementation uses the platform SubtleCrypto so we never pull a JS-side
// crypto polyfill into the bundle.

export class IntegrityError extends Error {
  readonly expected: string;
  readonly actual: string;
  constructor(expected: string, actual: string) {
    super(
      `worm: SHA-256 mismatch — expected ${expected}, computed ${actual}`,
    );
    this.name = 'IntegrityError';
    this.expected = expected;
    this.actual = actual;
  }
}

// sha256Hex returns the hex-encoded SHA-256 digest of the given bytes.
export async function sha256Hex(
  bytes: ArrayBuffer | Uint8Array,
): Promise<string> {
  const buf =
    bytes instanceof ArrayBuffer
      ? bytes
      : bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength,
        );
  const digest = await crypto.subtle.digest('SHA-256', buf as ArrayBuffer);
  return bufferToHex(digest);
}

// verifySha256 throws IntegrityError when the digest of `bytes` does not
// match `expected` (case-insensitive hex). Returns the computed digest on
// success so callers can log it.
export async function verifySha256(
  bytes: ArrayBuffer | Uint8Array,
  expected: string,
): Promise<string> {
  const actual = await sha256Hex(bytes);
  if (actual.toLowerCase() !== expected.toLowerCase()) {
    throw new IntegrityError(expected, actual);
  }
  return actual;
}

function bufferToHex(buf: ArrayBuffer): string {
  const view = new Uint8Array(buf);
  let out = '';
  for (let i = 0; i < view.length; i++) {
    out += view[i].toString(16).padStart(2, '0');
  }
  return out;
}
