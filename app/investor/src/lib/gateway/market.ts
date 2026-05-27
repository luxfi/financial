// market client — secondary-market browse + order entry + book +
// trade-history + my-orders (Stage 10.5). The order-place endpoint hits
// the G-37 pre-trade compliance gate (broker/pkg/pretrade) before
// routing through broker/pkg/router to the matching adapter (typically
// broker/pkg/provider/northcapital for NCPS-backed secondary trades).
//
// On gate denial the order is persisted with status 'gate_denied' and
// the Decision is returned so the browser can render the reasons +
// required actions. On gate allow the order proceeds; on escalate the
// order sits in 'gate_escalated' awaiting human review.

import { callGateway } from './transport';
import type {
  MarketOffering,
  MarketOrder,
  MarketOrderStatus,
  OrderBookSnapshot,
  PlaceOrderRequest,
  PlaceOrderResponse,
  TradePrint,
} from './types';

export const market = {
  // listOfferings returns every offering currently quoted on the
  // secondary venue, scoped to what the investor's accreditation
  // permits.
  async listOfferings(): Promise<MarketOffering[]> {
    return callGateway<MarketOffering[]>({
      service: 'broker',
      path: '/market/offerings',
    });
  },

  // orderBook returns the top-N levels of the book per side.
  async orderBook(offeringID: string, depth = 10): Promise<OrderBookSnapshot> {
    return callGateway<OrderBookSnapshot>({
      service: 'broker',
      path: `/market/offerings/${encodeURIComponent(offeringID)}/book`,
      query: { depth },
    });
  },

  // tradeHistory returns the most recent N trades (counterparty
  // anonymised on the server).
  async tradeHistory(
    offeringID: string,
    limit = 50,
  ): Promise<TradePrint[]> {
    return callGateway<TradePrint[]>({
      service: 'broker',
      path: `/market/offerings/${encodeURIComponent(offeringID)}/trades`,
      query: { limit },
    });
  },

  // listOrders returns the investor's open + recent orders. status filter
  // is server-side; client passes undefined for "all".
  async listOrders(
    status?: MarketOrderStatus | 'open_all' | 'closed_all',
  ): Promise<MarketOrder[]> {
    return callGateway<MarketOrder[]>({
      service: 'broker',
      path: '/market/orders',
      query: { status },
    });
  },

  // placeOrder runs the pre-trade gate and (on allow) routes the order.
  // Returns a PlaceOrderResponse that always carries the Decision so the
  // UI can render the gate result regardless of outcome.
  async placeOrder(req: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    return callGateway<PlaceOrderResponse>({
      service: 'broker',
      path: '/market/orders',
      method: 'POST',
      body: req,
    });
  },

  // cancelOrder withdraws an open order. The router refuses to cancel an
  // already-filled or expired order; surface the returned status to the
  // user.
  async cancelOrder(id: string): Promise<MarketOrder> {
    return callGateway<MarketOrder>({
      service: 'broker',
      path: `/market/orders/${encodeURIComponent(id)}`,
      method: 'DELETE',
    });
  },
};
