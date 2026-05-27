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

export const gateway = {
  captable,
  transfer,
  treasury,
  broker,
  audit,
} as const;

export type Gateway = typeof gateway;

export * from './transport';
export * from './types';
export * from './audit';
export type { CostBasisMethod } from './captable';
