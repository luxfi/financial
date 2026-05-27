// One import for every consumer:
//
//   import { gateway } from '@/lib/gateway';
//   const positions = await gateway.captable.listPositions();
//
// Each sub-client follows the same shape and enforces investor scope through
// the operator gateway. Pages should never call backends directly.
//
// Other G-22 agents extend this object by appending their sub-client here:
//   import { wallet } from './wallet';
//   gateway.wallet = wallet;
// The Gateway type widens automatically because the object is `as const`.

import { captable } from './captable';
import { transfer } from './transfer';
import { treasury } from './treasury';
import { broker } from './broker';
import { audit } from './audit';
// G-22b — Stage 10.2 / 10.3 / 10.6 clients.
import { document } from './document';
import { comms } from './comms';
import { tax } from './tax';
// G-22c — Stage 10.4 / 10.5 / 10.7 / 10.8 / 10.9 clients.
import { wallet } from './wallet';
import { market } from './market';
import { identity } from './identity';

export const gateway = {
  captable,
  transfer,
  treasury,
  broker,
  audit,
  document,
  comms,
  tax,
  wallet,
  market,
  identity,
} as const;

export type Gateway = typeof gateway;

export * from './transport';
export * from './types';
export * from './audit';
// G-22b re-exports.
export * from './document';
export * from './comms';
export * from './tax';
export type { CostBasisMethod } from './captable';
