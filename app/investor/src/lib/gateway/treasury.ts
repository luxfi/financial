// treasury client — cash-leg balances + recent treasury movements.
// Limited to the views the investor portal needs on the dashboard; the wallet
// surface (Stage 10.4) is owned by a separate agent. Investor scope enforced
// by the gateway.

import { callGateway } from './transport';

export interface CashBalance {
  currency: string;
  available: string;
  pending: string;
  asOf: string;
}

export const treasury = {
  // balances returns per-currency available + pending cash on the investor's
  // settlement account.
  async balances(): Promise<CashBalance[]> {
    return callGateway<CashBalance[]>({
      service: 'treasury',
      path: '/balances',
    });
  },
};
