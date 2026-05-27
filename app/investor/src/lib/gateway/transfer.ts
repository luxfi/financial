// transfer client — pending settlements for the investor's open trades.
// Backed by luxfi/transfer (ledger + restrictions) and luxfi/captable
// (settlement.SecondaryTrade) joined server-side. Investor only sees rows
// where buyer_investor_id or seller_investor_id matches their scope.

import { callGateway } from './transport';
import type { PendingSettlement } from './types';

export const transfer = {
  // listPendingSettlements returns rows in T+0/T+1/T+2 buckets that have not
  // yet settled. Useful for the dashboard "Pending settlement" panel.
  async listPendingSettlements(): Promise<PendingSettlement[]> {
    return callGateway<PendingSettlement[]>({
      service: 'transfer',
      path: '/settlements/pending',
    });
  },
};
