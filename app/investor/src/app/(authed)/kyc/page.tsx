// KYC & suitability — Stage 10.7 + 10.8.
//
// Three flows on one page (one per concern, each surfaces a prompt only
// when stale or expiring):
//
//   1. KYC refresh — prompts when KYC > 24 months stale (FinCEN-CDD
//      baseline). Collects refreshed PII + W-9 (US) / W-8 (non-US).
//   2. Accreditation renewal — prompts when accreditation > 365 days
//      stale, or > 90 days for 506(c) third-party. Method picker + doc
//      ids (already uploaded via the documents surface) + qualified-
//      purchaser opt-in.
//   3. W-8 renewal (3-year cycle, Treas. Reg. §1.1441-1(e)(4)(ii)(A))
//      — prompts when the W-8 expires within 90 days.
//
// Source-of-design: Lux-Prior-IP
// Source-ref: captable/pkg/kyc (types.go) + broker/pkg/provider/
//   northcapital (PerformKYC, PerformAccredited).

import { Card, Notice, PageHeader } from '@/components/data';
import { gateway, type IdentityProfile } from '@/lib/gateway';
import { fmtDate } from '@/lib/format';
import { AccreditationForm } from './AccreditationForm';
import { KYCRefreshForm } from './KYCRefreshForm';
import { W8RenewalForm } from './W8RenewalForm';

export const dynamic = 'force-dynamic';

function daysBetween(a: string | null | undefined, now = new Date()): number | null {
  if (!a) return null;
  const t = new Date(a).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.floor((now.getTime() - t) / 86_400_000);
}

function daysUntil(a: string | null | undefined, now = new Date()): number | null {
  if (!a) return null;
  const t = new Date(a).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.floor((t - now.getTime()) / 86_400_000);
}

function isUS(profile: IdentityProfile): boolean {
  return profile.countryOfTaxResidence === 'US';
}

export default async function KYCPage() {
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
          title="KYC & Suitability"
          subtitle="Refresh KYC, renew accreditation, and renew your W-8 on schedule."
        />
        <Notice tone="error">{error ?? 'Profile unavailable.'}</Notice>
      </>
    );
  }

  const kycAge = daysBetween(profile.kyc.verifiedAt);
  const kycStale = (kycAge ?? 999_999) > 365 * 2; // 24-month FinCEN baseline
  const accAge = daysBetween(profile.accreditation.verifiedAt);
  const accStale = (accAge ?? 999_999) > 365;
  const w8DaysLeft = daysUntil(profile.taxForm.threeYearCycleExpiresAt);
  const w8NearExpiry =
    w8DaysLeft !== null && w8DaysLeft <= 90 && profile.taxForm.type !== 'w9';

  return (
    <>
      <PageHeader
        title="KYC & Suitability"
        subtitle="Refresh KYC, renew accreditation, and renew your W-8 on schedule."
      />

      <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <StatusCard
          title="KYC"
          status={kycStale ? 'stale' : profile.kyc.status}
          line1={`Verified ${profile.kyc.verifiedAt ? fmtDate(profile.kyc.verifiedAt) : '—'}`}
          line2={
            kycAge !== null ? `${kycAge} days ago` : 'Never verified'
          }
          warn={kycStale}
          warnText="KYC has been stale for more than 24 months."
        />
        <StatusCard
          title="Accreditation"
          status={accStale ? 'stale' : profile.accreditation.status}
          line1={profile.accreditation.method ?? '—'}
          line2={
            accAge !== null ? `${accAge} days since last verification` : 'Never verified'
          }
          warn={accStale}
          warnText="Accreditation has been stale for more than 365 days."
        />
        <StatusCard
          title="Tax form"
          status={w8NearExpiry ? 'expiring' : 'current'}
          line1={profile.taxForm.type.toUpperCase()}
          line2={
            profile.taxForm.threeYearCycleExpiresAt
              ? `Expires ${fmtDate(profile.taxForm.threeYearCycleExpiresAt)}`
              : 'No expiry'
          }
          warn={w8NearExpiry}
          warnText={
            w8NearExpiry
              ? `W-8 expires in ${w8DaysLeft} days. Renew before expiry to avoid 30% backup withholding.`
              : ''
          }
        />
      </div>

      <div id="kyc" className="mb-6">
        <Card
          title={kycStale ? 'KYC refresh required' : 'Refresh KYC'}
          subtitle="Re-attest your PII and tax form. Backed by captable/pkg/kyc and the NCPS PerformKYC adapter."
        >
          <KYCRefreshForm profile={profile} isUS={isUS(profile)} />
        </Card>
      </div>

      <div id="accreditation" className="mb-6">
        <Card
          title={accStale ? 'Accreditation renewal required' : 'Renew accreditation'}
          subtitle="Income / net-worth docs, 506(c) third-party verification, or qualified-purchaser status. Routes to northcapital.PerformAccredited."
        >
          <AccreditationForm profile={profile} />
        </Card>
      </div>

      {profile.taxForm.type !== 'w9' ? (
        <div id="w8" className="mb-6">
          <Card
            title={w8NearExpiry ? 'W-8 renewal required' : 'Renew W-8'}
            subtitle="3-year cycle per Treasury Reg. §1.1441-1(e)(4)(ii)(A). Updates withholding rate via captable/pkg/tax."
          >
            <W8RenewalForm profile={profile} />
          </Card>
        </div>
      ) : null}
    </>
  );
}

function StatusCard({
  title,
  status,
  line1,
  line2,
  warn,
  warnText,
}: {
  title: string;
  status: string;
  line1: string;
  line2: string;
  warn: boolean;
  warnText: string;
}) {
  return (
    <div
      className={[
        'rounded-xl border p-4',
        warn
          ? 'border-[var(--color-warning)] bg-[var(--color-surface)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)]',
      ].join(' ')}
    >
      <div className="text-[1.1rem] uppercase tracking-[0.06em] text-[var(--color-muted)]">
        {title}
      </div>
      <div className="text-[1.8rem] font-semibold mt-1">{status}</div>
      <div className="text-[1.2rem] text-[var(--color-secondary)] mt-1">{line1}</div>
      <div className="text-[1.2rem] text-[var(--color-muted)]">{line2}</div>
      {warn && warnText ? (
        <div className="text-[1.2rem] text-[var(--color-warning)] mt-2">{warnText}</div>
      ) : null}
    </div>
  );
}
