import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import { buildSignOutUrl } from '@/lib/auth';

// Signout clears the session cookie and bounces to IAM's logout endpoint to
// terminate the upstream session. IAM then redirects back to /signin.
export const dynamic = 'force-dynamic';

export default async function SignOut() {
  const c = await cookies();
  c.delete(env.sessionCookie);
  const origin = process.env.NEXT_PUBLIC_PORTAL_URL ?? 'https://investor.lux.financial';
  redirect(buildSignOutUrl(`${origin}/signin`));
}
