// Magic-link request handler. Posts the email to IAM's magic-link endpoint;
// IAM emails the recipient a one-time link that lands on this portal's
// /api/auth/callback route. Regardless of outcome we redirect back to
// /signin with a success/error flag — never leak whether the email exists.

import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<Response> {
  const form = await req.formData();
  const email = String(form.get('email') ?? '').trim();
  const returnTo = String(form.get('return_to') ?? '/dashboard');
  if (!email) return back(req, 'email required');

  const url = new URL('/oauth/magic-link', env.iamUrl);
  const body = new URLSearchParams();
  body.set('client_id', env.iamClientId);
  body.set('email', email);
  body.set(
    'redirect_uri',
    `${req.nextUrl.origin}/api/auth/callback?return_to=${encodeURIComponent(returnTo)}`,
  );

  try {
    await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      cache: 'no-store',
    });
  } catch {
    /* swallow — surface the same message regardless */
  }
  return back(req, '', 'Check your email for a sign-in link.');
}

function back(req: NextRequest, error: string, info?: string): NextResponse {
  const url = new URL('/signin', req.nextUrl.origin);
  if (error) url.searchParams.set('error', error);
  if (info) url.searchParams.set('info', info);
  return NextResponse.redirect(url, { status: 303 });
}
