// captable client — positions + portfolio summary + cost-basis aggregates.
// Backed by luxfi/captable (omnisub Position + stakeholder Holding) routed
// through the gateway with investor scope enforced.

import { callGateway } from './transport';
import type { Position, PortfolioSummary } from './types';

export type CostBasisMethod = 'fifo' | 'lifo' | 'specific';

export const captable = {
  // listPositions returns every open position for the authenticated investor
  // across every offering they hold a stake in. The cost-basis aggregation
  // method (FIFO / LIFO / specific-lot) is computed server-side.
  async listPositions(method: CostBasisMethod = 'fifo'): Promise<Position[]> {
    return callGateway<Position[]>({
      service: 'captable',
      path: '/positions',
      query: { method },
    });
  },

  // portfolioSummary returns total NAV / cost-basis / unrealized P&L plus
  // 24h / 7d / 30d deltas.
  async portfolioSummary(
    method: CostBasisMethod = 'fifo',
  ): Promise<PortfolioSummary> {
    return callGateway<PortfolioSummary>({
      service: 'captable',
      path: '/portfolio/summary',
      query: { method },
    });
  },
};
