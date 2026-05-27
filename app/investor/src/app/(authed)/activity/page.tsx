import { Card, Notice, PageHeader } from '@/components/data';
import { gateway, type AuditCategory, type AuditOutcome } from '@/lib/gateway';
import { ActivityFilters } from './ActivityFilters';
import { AuditTimeline } from './AuditTimeline';
import { ExportButton } from './ExportButton';

// Activity log — Stage 10.10.
//
// Investor-initiated audit log: login, document view, trade actions,
// withdrawal requests, profile / beneficiary changes. Filtered by category +
// outcome + date range. Backed by the gateway's /v1/audit endpoint which
// reads from every backend's audit sink (worm.AuditLog, broker audit,
// treasury journal, captable stakeholder events) and scopes by investor.

export const dynamic = 'force-dynamic';

const CATEGORIES: AuditCategory[] = [
  'auth',
  'document',
  'trade',
  'withdrawal',
  'profile',
  'beneficiary',
  'kyc',
  'comms',
];

const OUTCOMES: AuditOutcome[] = ['success', 'failure', 'denied', 'pending'];

function asCategory(v: string | undefined): AuditCategory | undefined {
  return v && (CATEGORIES as string[]).includes(v) ? (v as AuditCategory) : undefined;
}

function asOutcome(v: string | undefined): AuditOutcome | undefined {
  return v && (OUTCOMES as string[]).includes(v) ? (v as AuditOutcome) : undefined;
}

function first(
  v: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const category = first(sp.category) ?? '';
  const outcome = first(sp.outcome) ?? '';
  const since = first(sp.since) ?? '';
  const until = first(sp.until) ?? '';
  const cursor = first(sp.cursor);

  const cat = asCategory(category);
  const out = asOutcome(outcome);

  let page;
  let error: string | null = null;
  try {
    page = await gateway.audit.list({
      category: cat,
      outcome: out,
      since: since || undefined,
      until: until || undefined,
      cursor,
      limit: 200,
    });
  } catch (e) {
    error = (e as Error).message;
    page = { entries: [] };
  }

  return (
    <>
      <PageHeader
        title="Activity Log"
        subtitle="Investor-initiated actions across the portal — auth, documents, trades, withdrawals, profile changes."
        actions={
          <ExportButton
            category={category}
            outcome={outcome}
            since={since}
            until={until}
          />
        }
      />

      <Card>
        <ActivityFilters
          category={category}
          outcome={outcome}
          since={since}
          until={until}
        />
      </Card>

      <div className="mt-4">
        {error ? (
          <Notice tone="error">Unable to load activity: {error}</Notice>
        ) : (
          <Card>
            <AuditTimeline entries={page.entries} />
            {page.nextCursor ? (
              <div className="mt-4 text-right">
                <a
                  href={(() => {
                    const u = new URLSearchParams();
                    if (category) u.set('category', category);
                    if (outcome) u.set('outcome', outcome);
                    if (since) u.set('since', since);
                    if (until) u.set('until', until);
                    u.set('cursor', page.nextCursor);
                    return `?${u.toString()}`;
                  })()}
                  className="text-[var(--color-secondary)] hover:text-[var(--color-foreground)] text-[1.3rem]"
                >
                  Next page →
                </a>
              </div>
            ) : null}
          </Card>
        )}
      </div>
    </>
  );
}
