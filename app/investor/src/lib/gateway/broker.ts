// broker client — order / position / activity views from the broker-dealer
// service. Investor scope = X-Lux-Investor-Id; the gateway maps that to the
// account ownership chain enforced by luxfi/broker.

import { callGateway } from './transport';

export interface BrokerOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  status: string;
  qty: string;
  filledQty: string;
  price: string;
  submittedAt: string;
}

export const broker = {
  async listOpenOrders(): Promise<BrokerOrder[]> {
    return callGateway<BrokerOrder[]>({
      service: 'broker',
      path: '/orders',
      query: { status: 'open' },
    });
  },
};
