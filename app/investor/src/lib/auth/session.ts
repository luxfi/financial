// Session model. The portal stores the IAM-issued access token in an
// HTTP-only cookie; the middleware verifies the JWT signature against the
// IAM JWKS, scopes the request to (investorID, tenantID), and forwards
// identity headers to the gateway.

import { jwtVerify, createRemoteJWKSet, type JWTPayload } from 'jose';
import { env } from '../env';

export interface InvestorSession {
  // sub: stable IAM subject identifier.
  sub: string;
  // investorID: the captable/broker investor record this user controls.
  investorID: string;
  // tenantID: the issuer tenant the investor belongs to.
  tenantID: string;
  // email: contact email for the principal.
  email: string;
  // name: display name.
  name: string;
  // exp: token expiry (unix seconds).
  exp: number;
}

// One JWKS client across the process; cached and refreshed by jose.
let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function jwks() {
  if (!_jwks) _jwks = createRemoteJWKSet(new URL(env.iamJwksUrl));
  return _jwks;
}

export class SessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SessionError';
  }
}

// verifyToken validates a JWT against the IAM JWKS, audience, and issuer.
// Throws SessionError on any failure; returns a typed session on success.
export async function verifyToken(token: string): Promise<InvestorSession> {
  if (!token) throw new SessionError('empty token');
  let payload: JWTPayload;
  try {
    const result = await jwtVerify(token, jwks(), {
      issuer: env.iamIssuer,
      audience: env.iamAudience,
    });
    payload = result.payload;
  } catch (err) {
    throw new SessionError(
      `jwt verification failed: ${(err as Error).message}`,
    );
  }

  const investorID = typeof payload.investor_id === 'string'
    ? payload.investor_id
    : '';
  const tenantID = typeof payload.tenant_id === 'string'
    ? payload.tenant_id
    : (typeof payload.owner === 'string' ? payload.owner : '');

  if (!investorID) throw new SessionError('missing investor_id claim');
  if (!tenantID) throw new SessionError('missing tenant_id / owner claim');
  if (!payload.sub) throw new SessionError('missing sub claim');

  return {
    sub: payload.sub,
    investorID,
    tenantID,
    email: typeof payload.email === 'string' ? payload.email : '',
    name: typeof payload.name === 'string' ? payload.name : '',
    exp: typeof payload.exp === 'number' ? payload.exp : 0,
  };
}

// readSessionFromHeaders fishes the session out of the identity headers
// the middleware injected on the request. Server components call this.
export function readSessionFromHeaders(
  headers: Headers | Record<string, string | undefined>,
): InvestorSession | null {
  const get = (k: string) => {
    if (headers instanceof Headers) return headers.get(k) ?? '';
    return (headers[k] ?? headers[k.toLowerCase()] ?? '') as string;
  };
  const investorID = get('x-lux-investor-id');
  const tenantID = get('x-lux-tenant-id');
  const sub = get('x-lux-sub');
  if (!investorID || !tenantID || !sub) return null;
  const exp = Number(get('x-lux-exp') || '0');
  return {
    sub,
    investorID,
    tenantID,
    email: get('x-lux-email') || '',
    name: get('x-lux-name') || '',
    exp: Number.isFinite(exp) ? exp : 0,
  };
}
