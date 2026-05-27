import { Suspense } from 'react';
import { Card, Notice, PageHeader } from '@/components/data';
import { gateway, type CostBasisMethod } from '@/lib/gateway';
import { PortfolioSummaryCard } from './PortfolioSummary';
import { PositionsTable } from './PositionsTable';
import { PendingSettlementsCard } from './PendingSettlements';
import { CostBasisToggle } from './CostBasisToggle';

// Dashboard — Stage 10.1.
//
// Positions, NAV, cost basis (FIFO / LIFO / specific), unrealized P&L,
// pending settlement panel. Server-rendered on every request; the only
// client component is the cost-basis toggle that pushes ?method=…

export const dynamic = 'force-dynamic';

function normaliseMethod(v: string | undefined): CostBasisMethod {
  if (v === 'lifo' || v === 'specific') return v;
  return 'fifo';
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const method = normaliseMethod(
    Array.isArray(sp.method) ? sp.method[0] : sp.method,
  );

  const result = await Promise.allSettled([
    gateway.captable.portfolioSummary(method),
    gateway.captable.listPositions(method),
    gateway.transfer.listPendingSettlements(),
  ]);

  const [summaryR, positionsR, settlementsR] = result;
  const errors = result
    .map((r, i) => (r.status === 'rejected' ? `${['summary', 'positions', 'settlements'][i]}: ${String(r.reason)}` : null))
    .filter((s): s is string => Boolean(s));

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Positions, NAV, cost basis, unrealized P&L, and pending settlement."
        actions={<CostBasisToggle value={method} />}
      />

      {errors.length > 0 ? (
        <div className="mb-4">
          <Notice tone="error">Unable to load: {errors.join('; ')}</Notice>
        </div>
      ) : null}

      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {summaryR.status === 'fulfilled' ? (
          <PortfolioSummaryCard summary={summaryR.value} />
        ) : (
          <Card title="Portfolio NAV">
            <Notice tone="error">Summary unavailable.</Notice>
          </Card>
        )}

        <Card title="Positions" subtitle={`Method: ${method.toUpperCase()}`}>
          <Suspense fallback={<p>Loading positions…</p>}>
            {positionsR.status === 'fulfilled' ? (
              <PositionsTable positions={positionsR.value} />
            ) : (
              <Notice tone="error">Positions unavailable.</Notice>
            )}
          </Suspense>
        </Card>
      </div>

      <div className="mt-6">
        {settlementsR.status === 'fulfilled' ? (
          <PendingSettlementsCard settlements={settlementsR.value} />
        ) : (
          <Card title="Pending settlement">
            <Notice tone="error">Settlement view unavailable.</Notice>
          </Card>
        )}
      </div>
    </>
  );
}
