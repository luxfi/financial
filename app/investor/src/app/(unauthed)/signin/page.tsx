import Link from 'next/link';
import { LUX_BRAND } from '@luxbank/brand';
import { Card, Notice } from '@/components/data';
import { Button } from '@/components/forms';
import { env } from '@/lib/env';
import { buildAuthorizeUrl } from '@/lib/auth';

// Sign-in. Two paths:
//
//   1. OIDC against Hanzo IAM — the recommended path. Click "Continue with
//      Lux IAM" which redirects into iam.luxfi.io with the OAuth code-flow
//      parameters. On callback the /api/auth/callback route exchanges the
//      code and drops the session cookie.
//   2. Magic-link — fallback for investors who don't have IAM credentials
//      yet. Posts to /api/auth/magic-link which has IAM issue a one-time
//      magic-link email; on the link the same callback route runs.

export const dynamic = 'force-dynamic';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const returnTo = (Array.isArray(sp.return_to) ? sp.return_to[0] : sp.return_to) ?? '/dashboard';
  const err = (Array.isArray(sp.error) ? sp.error[0] : sp.error) ?? '';
  const callback = `${env.iamUrl ? '' : ''}/api/auth/callback?return_to=${encodeURIComponent(returnTo)}`;
  // The IAM-side redirect lands back on this domain at /api/auth/callback.
  // We build the authorize URL with the absolute callback URL; for static
  // export the origin is taken from the request, not env, so the magic-link
  // form posts to a relative endpoint.
  const authorizeUrl = buildAuthorizeUrl(
    typeof window === 'undefined' ? `__ORIGIN__${callback}` : `${window.location.origin}${callback}`,
  );

  return (
    <Card className="w-[min(420px,100%)]">
      <h1 className="text-[2.2rem] font-bold mb-2">
        Sign in to {LUX_BRAND.name} Investor
      </h1>
      <p className="text-[1.3rem] text-[var(--color-secondary)] mb-4">
        Investor-only access. Authenticate with your {LUX_BRAND.name} IAM
        account or request a one-time sign-in link.
      </p>

      {err ? (
        <div className="mb-4">
          <Notice tone="error">{err}</Notice>
        </div>
      ) : null}

      <a
        href={authorizeUrl}
        className="block"
        data-testid="signin-oidc"
      >
        <Button className="w-full">Continue with {LUX_BRAND.name} IAM</Button>
      </a>

      <div className="my-4 text-center text-[1.2rem] text-[var(--color-muted)]">
        or request a magic link
      </div>

      <form
        action="/api/auth/magic-link"
        method="post"
        className="flex flex-col gap-3"
        data-testid="signin-magic-link"
      >
        <label htmlFor="email" className="text-[1.2rem] text-[var(--color-secondary)]">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="h-10 px-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[1.3rem]"
        />
        <input type="hidden" name="return_to" value={returnTo} />
        <Button type="submit" variant="ghost">
          Email me a sign-in link
        </Button>
      </form>

      <p className="text-[1.1rem] text-[var(--color-muted)] mt-4">
        By signing in you agree to the {LUX_BRAND.jurisdiction.legalEntity.name}{' '}
        investor-portal terms.{' '}
        <Link
          href="/help/terms"
          className="underline hover:text-[var(--color-foreground)]"
        >
          Terms
        </Link>
      </p>
    </Card>
  );
}
