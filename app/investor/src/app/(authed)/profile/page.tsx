// Profile & address — Stage 10.8.
//
// Beneficial-owner / address change with audit logging. Submitting the
// form writes a row to the audit sink, triggers an OFAC re-screen, and
// updates the address used by every downstream system (cap-table,
// transfer agent, treasury wire instructions, tax form delivery).

import { Card, Notice, PageHeader } from '@/components/data';
import { gateway, type IdentityProfile } from '@/lib/gateway';
import { ProfileForm } from './ProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  let profile: IdentityProfile | null = null;
  let error: string | null = null;
  try {
    profile = await gateway.identity.profile();
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <>
      <PageHeader
        title="Profile & Address"
        subtitle="Update contact and beneficial-owner details. Address changes trigger a fresh OFAC screen and update every downstream record."
      />
      {!profile || error ? (
        <Notice tone="error">{error ?? 'Profile unavailable.'}</Notice>
      ) : (
        <Card>
          <ProfileForm profile={profile} />
        </Card>
      )}
    </>
  );
}
