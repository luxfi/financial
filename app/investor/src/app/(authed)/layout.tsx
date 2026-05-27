import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { LUX_BRAND } from '@luxbank/brand';
import { Shell } from '@/components/shell';
import { readSessionFromHeaders, buildSignOutUrl } from '@/lib/auth';

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const session = readSessionFromHeaders(h);
  if (!session) redirect('/signin');

  // The browser actually lands on /signout which clears the cookie and then
  // bounces to IAM's logout endpoint. The signout page lives outside (authed).
  const signOutHref = '/signout';

  return (
    <Shell
      brandName={LUX_BRAND.name}
      brandLegalEntity={LUX_BRAND.jurisdiction.legalEntity.name}
      investorName={session.name}
      investorEmail={session.email}
      signOutHref={signOutHref}
    >
      {children}
    </Shell>
  );
}
