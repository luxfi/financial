// wallet client — payment-method management for the investor portal
// (Stage 10.4). Backed by treasury/pkg/provider/* on the operator side:
//   - ACH: plaid + moderntreasury
//   - Card: stripe
//   - Wire: moderntreasury / column
//   - IRA: northcapital (TransactAPI custody)
//   - Stablecoin: bridge + lux/mpc (custodial) or walletconnect (self-custody)
//
// The investor only ever sees the redacted PaymentMethod shape; raw account
// / card / wallet data never leaves the operator side.

import { callGateway } from './transport';
import type {
  AddPaymentMethodRequest,
  PaymentMethod,
  PaymentMethodStatus,
} from './types';

export const wallet = {
  // list returns every payment method linked to the investor across every
  // rail. Already filtered by investor scope on the gateway.
  async list(): Promise<PaymentMethod[]> {
    return callGateway<PaymentMethod[]>({
      service: 'treasury',
      path: '/wallet/methods',
    });
  },

  // add creates a new payment method. The treasury provider chosen on
  // the operator side is determined by `kind`; the payload shape is
  // validated server-side.
  async add(
    req: AddPaymentMethodRequest,
    idempotencyKey?: string,
  ): Promise<PaymentMethod> {
    return callGateway<PaymentMethod>({
      service: 'treasury',
      path: '/wallet/methods',
      method: 'POST',
      body: { ...req, idempotencyKey },
    });
  },

  // verify resumes verification on a method in the pending_micro_deposits
  // state (ACH) or pending OFAC screen (stablecoin). The body carries
  // verification proof in a kind-specific shape; the gateway validates.
  async verify(
    id: string,
    proof: Record<string, string>,
  ): Promise<PaymentMethod> {
    return callGateway<PaymentMethod>({
      service: 'treasury',
      path: `/wallet/methods/${encodeURIComponent(id)}/verify`,
      method: 'POST',
      body: proof,
    });
  },

  // unlink closes the payment method. Once unlinked, the method cannot
  // be reactivated — the investor adds a fresh one.
  async unlink(id: string): Promise<{ id: string; status: PaymentMethodStatus }> {
    return callGateway({
      service: 'treasury',
      path: `/wallet/methods/${encodeURIComponent(id)}`,
      method: 'DELETE',
    });
  },

  // setDefault marks a method as default for the named use. The backend
  // enforces "at most one default per use per investor".
  async setDefault(
    id: string,
    use: 'settlement' | 'distributions',
  ): Promise<PaymentMethod> {
    return callGateway<PaymentMethod>({
      service: 'treasury',
      path: `/wallet/methods/${encodeURIComponent(id)}/default`,
      method: 'POST',
      body: { use },
    });
  },
};
