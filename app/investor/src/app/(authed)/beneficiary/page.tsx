// Beneficiary / TOD designation — Stage 10.9.
//
// Per-jurisdiction-aware form. The single-state-of-residence default
// covers UPC / probate states; community-property and forced-heirship
// jurisdictions surface a warning that the slate may be modified by
// statute. The actual jurisdiction analysis lives server-side; this UI
// renders the resulting flag.
//
// High-value-account thresholds (issuer policy) route the upsert
// through transfer/pkg/legalprocess dual-control; the response carries
// status === 'pending_dual_control' until both approvers sign. The UI
// surfaces the case id for tracking.
//
// Source-of-design: Lux-Prior-IP
// Source-ref: transfer/pkg/legalprocess (types.go: Case + Approval) +
//   captable/pkg/stakeholder (Holding + beneficiary attestation).

import { Card, Notice, PageHeader } from '@/components/data';
import { gateway, type Beneficiary, type IdentityProfile } from '@/lib/gateway';
import { BeneficiaryEditor } from './BeneficiaryEditor';

export const dynamic = 'force-dynamic';

const COMMUNITY_PROPERTY_US = new Set([
  'AZ',
  'CA',
  'ID',
  'LA',
  'NV',
  'NM',
  'TX',
  'WA',
  'WI',
]);
const FORCED_HEIRSHIP_JURISDICTIONS = new Set([
  'FR',
  'IT',
  'ES',
  'DE',
  'JP',
  'AR',
  'BR',
  'CH',
  'BE',
  'NL',
  'PT',
  'SA',
  'KW',
  'AE',
]);

function jurisdictionWarning(profile: IdentityProfile): string | null {
  const country = profile.countryOfTaxResidence;
  if (country === 'US') {
    if (COMMUNITY_PROPERTY_US.has(profile.address.state)) {
      return `Your address is in ${profile.address.state}, a community-property state. Your spouse may have a statutory interest that overrides this designation; consult counsel for community-property carve-outs.`;
    }
    return null;
  }
  if (FORCED_HEIRSHIP_JURISDICTIONS.has(country)) {
    return `Your country of tax residence (${country}) recognises forced heirship. Statutory shares for protected heirs may override the slate below; consult counsel before relying on this designation.`;
  }
  return null;
}

export default async function BeneficiaryPage() {
  let profile: IdentityProfile | null = null;
  let error: string | null = null;
  try {
    profile = await gateway.identity.profile();
  } catch (e) {
    error = (e as Error).message;
  }

  if (!profile) {
    return (
      <>
        <PageHeader
          title="Beneficiary / TOD"
          subtitle="Designate beneficiaries / transfer-on-death recipients per holding."
        />
        <Notice tone="error">{error ?? 'Profile unavailable.'}</Notice>
      </>
    );
  }

  const warning = jurisdictionWarning(profile);
  const pending = profile.beneficiaries.filter(
    (b: Beneficiary) => b.status === 'pending_dual_control',
  );

  return (
    <>
      <PageHeader
        title="Beneficiary / TOD"
        subtitle="Designate beneficiaries / transfer-on-death recipients. Shares must sum to 1.00. High-value accounts require dual-control approval."
      />

      {warning ? (
        <div className="mb-4">
          <Notice tone="warn">{warning}</Notice>
        </div>
      ) : null}

      {pending.length > 0 ? (
        <div className="mb-4">
          <Notice tone="info">
            <div className="font-medium">
              {pending.length} pending designation{pending.length === 1 ? '' : 's'}
            </div>
            <ul className="text-[1.3rem]">
              {pending.map((b) => (
                <li key={b.id}>
                  {b.legalName} ·{' '}
                  <span className="font-mono">{b.dualControlCaseID}</span>
                </li>
              ))}
            </ul>
          </Notice>
        </div>
      ) : null}

      <Card>
        <BeneficiaryEditor
          initial={profile.beneficiaries.filter(
            (b) => b.status === 'active' || b.status === 'pending_dual_control',
          )}
        />
      </Card>
    </>
  );
}
