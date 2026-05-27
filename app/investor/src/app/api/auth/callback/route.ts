// OIDC callback. IAM exchanges the auth code for an access token by calling
// its own /oauth/token endpoint; the portal forwards the code, attaches the
// client_id, and on success drops the session cookie.
//
// The token returned is the JWT the middleware will verify on subsequent
// requests against the JWKS.

import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function GET(req: NextRequest): Promise<Response> {
  const sp = req.nextUrl.searchParams;
  const code = sp.get('code') ?? '';
  const returnTo = sp.get('return_to') ?? '/dashboard';
  if (!code) {
    return redirectSignIn(req, 'missing authorization code');
  }

  const tokenURL = new URL('/oauth/token', env.iamUrl);
  const params = new URLSearchParams();
  params.set('grant_type', 'authorization_code');
  params.set('code', code);
  params.set('client_id', env.iamClientId);
  params.set(
    'redirect_uri',
    `${req.nextUrl.origin}/api/auth/callback?return_to=${encodeURIComponent(returnTo)}`,
  );

  let token: TokenResponse;
  try {
    const res = await fetch(tokenURL.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      cache: 'no-store',
    });
    if (!res.ok) {
      return redirectSignIn(req, `token exchange failed: ${res.status}`);
    }
    token = (await res.json()) as TokenResponse;
  } catch (e) {
    return redirectSignIn(req, `token exchange error: ${(e as Error).message}`);
  }

  // Sanity check — verify the token shape before we set the cookie. Any
  // failure ↑ redirects rather than silently storing a bad token.
  try {
    await verifyToken(token.access_token);
  } catch (e) {
    return redirectSignIn(req, `token verification failed: ${(e as Error).message}`);
  }

  const c = await cookies();
  c.set(env.sessionCookie, token.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.max(60, token.expires_in - 30),
  });

  return NextResponse.redirect(new URL(returnTo, req.nextUrl.origin));
}

function redirectSignIn(req: NextRequest, error: string): NextResponse {
  const url = new URL('/signin', req.nextUrl.origin);
  url.searchParams.set('error', error);
  return NextResponse.redirect(url);
}
