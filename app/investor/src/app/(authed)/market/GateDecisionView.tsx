// GateDecisionView — renders a broker/pkg/pretrade.Decision the operator
// returned on order submission. Allow → green confirmation, Deny → red
// list of reasons + required actions, Escalate → yellow notice with the
// reasons and an explanation that human review is in progress.
//
// Required-action codes map to deep links in the identity / wallet
// surface so the investor can immediately address them.

import Link from 'next/link';
import { Notice } from '@/components/data';
import type { GateDecision } from '@/lib/gateway';
import { fmtDateTime } from '@/lib/format';

const ACTION_LABEL: Record<string, { label: string; href?: string }> = {
  renew_accreditation: {
    label: 'Renew accreditation',
    href: '/kyc#accreditation',
  },
  refresh_kyc: { label: 'Refresh KYC', href: '/kyc' },
  refresh_suitability: { label: 'Refresh suitability', href: '/kyc#suitability' },
  request_ofac_rescreen: {
    label: 'Request OFAC re-screen',
    href: '/kyc#ofac',
  },
  wait_lockup: { label: 'Wait for lockup expiry' },
  wait_rule144: { label: 'Wait for Rule 144 eligibility' },
  review_with_advisor: { label: 'Review with your advisor' },
  contact_support: { label: 'Contact support' },
};

function actionItem(code: string) {
  return ACTION_LABEL[code] ?? { label: code.replace(/_/g, ' ') };
}

export function GateDecisionView({ decision }: { decision: GateDecision }) {
  if (decision.allow) {
    return (
      <Notice tone="success">
        <div className="font-medium">Pre-trade compliance: cleared.</div>
        <div className="text-[1.2rem]">
          Evaluated {fmtDateTime(decision.evaluatedAt)} · latency{' '}
          {Math.round(decision.latencyNs / 1_000_000)} ms
        </div>
      </Notice>
    );
  }

  if (decision.deny) {
    return (
      <Notice tone="error">
        <div className="font-medium mb-2">
          Pre-trade compliance: denied.
        </div>
        <ul className="list-disc list-inside text-[1.3rem]">
          {decision.reasons.map((r) => (
            <li key={r.code}>
              <span className="font-mono text-[1.2rem] mr-2">{r.code}</span>
              {r.message}
            </li>
          ))}
        </ul>
        {decision.requiredActions.length > 0 ? (
          <div className="mt-3">
            <div className="text-[1.2rem] uppercase tracking-[0.06em] text-[var(--color-muted)] mb-1">
              Required actions
            </div>
            <ul className="flex gap-2 flex-wrap">
              {decision.requiredActions.map((c) => {
                const a = actionItem(c);
                return (
                  <li key={c}>
                    {a.href ? (
                      <Link
                        href={a.href}
                        className="text-[1.3rem] underline text-[var(--color-foreground)]"
                      >
                        {a.label}
                      </Link>
                    ) : (
                      <span className="text-[1.3rem]">{a.label}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </Notice>
    );
  }

  // escalate
  return (
    <Notice tone="warn">
      <div className="font-medium mb-2">
        Pre-trade compliance: held for review.
      </div>
      <p className="text-[1.3rem] mb-2">
        Your order is held while a reviewer evaluates the condition(s) below.
        We will surface the outcome to your inbox; you can also see the status
        on the My Orders panel.
      </p>
      <ul className="list-disc list-inside text-[1.3rem]">
        {decision.reasons.map((r) => (
          <li key={r.code}>
            <span className="font-mono text-[1.2rem] mr-2">{r.code}</span>
            {r.message}
          </li>
        ))}
      </ul>
    </Notice>
  );
}
