// Edge middleware. Every request to an (authed) route is gated here:
//
//  1. Read the session token from the HTTP-only cookie.
//  2. Verify the JWT signature against the IAM JWKS and check audience +
//     issuer.
//  3. Extract investor_id + tenant_id and inject them as identity headers
//     for downstream server components / route handlers.
//  4. Redirect to /signin on any failure.
//
// The same middleware authenticates every (authed) page added by any of the
// G-22 sub-agents (10.1, 10.10 here; 10.2 / 10.3 / 10.6 from agent B;
// 10.4 / 10.5 / 10.7 / 10.8 / 10.9 from agent C). New (authed) pages need
// no extra wiring; this middleware sees them by route prefix.

import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { verifyToken } from '@/lib/auth/session';

// The matcher excludes static assets and unauthenticated routes.
export const config = {
  matcher: [
    '/((?!_next|favicon.ico|signin|signout|api/auth|public|.*\\..*).*)',
  ],
};

export async function middleware(req: NextRequest): Promise<Response> {
  const url = req.nextUrl.clone();

  // Allow public files / known unauth routes.
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/signin') ||
    url.pathname.startsWith('/signout') ||
    url.pathname.startsWith('/api/auth') ||
    url.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(env.sessionCookie)?.value ?? '';
  if (!token) return redirectToSignIn(req, url);

  try {
    const session = await verifyToken(token);

    // Forward identity to downstream handlers via headers. Each backend
    // service receives these from the operator gateway, never from the
    // browser directly.
    const headers = new Headers(req.headers);
    headers.set('x-lux-sub', session.sub);
    headers.set('x-lux-investor-id', session.investorID);
    headers.set('x-lux-tenant-id', session.tenantID);
    headers.set('x-lux-email', session.email);
    headers.set('x-lux-name', session.name);
    headers.set('x-lux-exp', String(session.exp));

    return NextResponse.next({ request: { headers } });
  } catch {
    return redirectToSignIn(req, url);
  }
}

function redirectToSignIn(req: NextRequest, url: URL): NextResponse {
  const signin = new URL('/signin', req.url);
  if (url.pathname !== '/') signin.searchParams.set('return_to', url.pathname);
  return NextResponse.redirect(signin);
}
