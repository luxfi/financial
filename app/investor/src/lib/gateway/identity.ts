// identity client — KYC refresh (Stage 10.7), W-8/W-9 renewal (Stage
// 10.7 + 10.8), address change (Stage 10.8), beneficial owner update
// (Stage 10.8), and beneficiary / TOD designation (Stage 10.9).
//
// On the operator side this fans into captable/pkg/kyc (KYC + AML +
// accreditation), captable/pkg/tax (withholding rate update), and
// transfer/pkg/legalprocess (dual-control beneficiary workflow for
// high-value accounts).

import { callGateway } from './transport';
import type {
  AccreditationRefreshRequest,
  AddressChangeRequest,
  Beneficiary,
  BeneficiarySlate,
  IdentityProfile,
  KYCRefreshRequest,
  W8RenewalRequest,
} from './types';

export const identity = {
  // profile returns the investor's identity snapshot — used to drive the
  // refresh-prompt UI ("KYC > 24 months stale", "accreditation > 365
  // days stale", "W-8 expiring in N days").
  async profile(): Promise<IdentityProfile> {
    return callGateway<IdentityProfile>({
      service: 'captable',
      path: '/identity/profile',
    });
  },

  // refreshKYC submits a fresh KYC pack — W-9 (US) or W-8 (non-US) +
  // refreshed PII. Backend posts to captable/pkg/kyc and to the NCPS
  // adapter (PerformKYC).
  async refreshKYC(req: KYCRefreshRequest): Promise<IdentityProfile> {
    return callGateway<IdentityProfile>({
      service: 'captable',
      path: '/identity/kyc/refresh',
      method: 'POST',
      body: req,
    });
  },

  // refreshAccreditation submits a renewal — backend posts to
  // northcapital.PerformAccredited.
  async refreshAccreditation(
    req: AccreditationRefreshRequest,
  ): Promise<IdentityProfile> {
    return callGateway<IdentityProfile>({
      service: 'captable',
      path: '/identity/accreditation/refresh',
      method: 'POST',
      body: req,
    });
  },

  // renewW8 is the 3-year W-8 cycle renewal (Treas. Reg. §1.1441-1).
  // Backend routes to captable/pkg/tax for withholding-rate update.
  async renewW8(req: W8RenewalRequest): Promise<IdentityProfile> {
    return callGateway<IdentityProfile>({
      service: 'captable',
      path: '/identity/tax/w8/renew',
      method: 'POST',
      body: req,
    });
  },

  // changeAddress posts a beneficial-owner / address change. Backend
  // writes an audit-log row and triggers the OFAC re-screen.
  async changeAddress(req: AddressChangeRequest): Promise<IdentityProfile> {
    return callGateway<IdentityProfile>({
      service: 'captable',
      path: '/identity/address',
      method: 'POST',
      body: req,
    });
  },

  // setBeneficiaries replaces the entire beneficiary slate. Shares must
  // sum to 1; the backend rejects partial slates.
  //
  // High-value accounts (per issuer policy) route through transfer/pkg/
  // legalprocess dual-control. The response carries status
  // 'pending_dual_control' until both approvers sign; the UI then shows
  // the pending case id for tracking.
  async setBeneficiaries(slate: BeneficiarySlate): Promise<Beneficiary[]> {
    return callGateway<Beneficiary[]>({
      service: 'captable',
      path: '/identity/beneficiaries',
      method: 'PUT',
      body: slate,
    });
  },
};
