// Wire types shared across the gateway clients. These mirror the canonical
// Go structs in luxfi/captable, luxfi/transfer, luxfi/treasury, luxfi/broker.
// One TS interface per Go struct; JSON tags are the field names.
//
// Currency-bearing values are strings (decimal with up to 8 places) to avoid
// IEEE-754 rounding in the browser. Quantities are bigint-safe strings for the
// same reason; small lock-up/security identifiers stay as plain strings.

export type ISODate = string;

// ---- captable ----------------------------------------------------------

export interface CostBasisLot {
  id: string;
  securityID: string;
  quantity: string;
  costPerShare: string;
  acquiredDate: ISODate;
  method: 'fifo' | 'lifo' | 'specific';
}

export interface Position {
  id: string;
  investorID: string;
  tenantID: string;
  offeringID: string;
  offeringName: string;
  securityID: string;
  securityClass: string;
  quantity: string;
  costBasis: string;
  nav: string;
  unrealizedPnL: string;
  currency: string;
  lockupRemainingDays: number;
  restrictionsLabel: string;
  lots: CostBasisLot[];
  asOf: ISODate;
}

export interface PortfolioSummary {
  totalNAV: string;
  totalCostBasis: string;
  totalUnrealizedPnL: string;
  currency: string;
  deltas: {
    h24: string;
    d7: string;
    d30: string;
  };
  positionCount: number;
  asOf: ISODate;
}

// ---- transfer (settlement view) ----------------------------------------

export type SettlementBucket = 'T+0' | 'T+1' | 'T+2' | 'T+3';

export interface PendingSettlement {
  tradeID: string;
  side: 'buy' | 'sell';
  securityID: string;
  securityName: string;
  quantity: string;
  price: string;
  grossAmount: string;
  currency: string;
  bucket: SettlementBucket;
  expectedSettlementDate: ISODate;
  status:
    | 'pending_compliance_clearance'
    | 'pending_transfer'
    | 'executed'
    | 'failed'
    | 'cancelled';
}

// ---- audit -------------------------------------------------------------

export type AuditCategory =
  | 'auth'
  | 'document'
  | 'trade'
  | 'withdrawal'
  | 'profile'
  | 'beneficiary'
  | 'kyc'
  | 'comms';

export type AuditOutcome = 'success' | 'failure' | 'denied' | 'pending';

export interface AuditEntry {
  id: string;
  ts: ISODate;
  investorID: string;
  tenantID: string;
  category: AuditCategory;
  // Action verb, e.g. 'login', 'document.view', 'trade.place',
  // 'withdrawal.request', 'beneficiary.update'.
  action: string;
  // Free-form target reference (security ID, document ID, trade ID, etc).
  target: string;
  // Human-readable description.
  description: string;
  ip: string;
  userAgent: string;
  outcome: AuditOutcome;
  // Optional error message on failure outcomes.
  err?: string;
}

export interface AuditPage {
  entries: AuditEntry[];
  nextCursor?: string;
}

// ---- wallet / payment methods (Stage 10.4) ----------------------------
//
// One unified PaymentMethod shape across ACH / card / wire / IRA / stable-
// coin. The backend keeps the per-rail provider details in `meta`; the
// browser only consumes the fields it can render. Default-status is
// scoped to a use ("distributions" or "settlement") so an investor can
// have one default per use without us conflating them.

export type PaymentMethodKind =
  | 'ach'
  | 'card'
  | 'wire'
  | 'ira'
  | 'stablecoin';

export type PaymentMethodStatus =
  | 'unverified'
  | 'pending_micro_deposits'
  | 'verified'
  | 'failed'
  | 'closed';

export interface PaymentMethod {
  id: string;
  investorID: string;
  tenantID: string;
  kind: PaymentMethodKind;
  // Provider that owns the underlying account (e.g. "plaid",
  // "moderntreasury", "stripe", "northcapital", "luxmpc",
  // "walletconnect"). Surfaced as a small label on the row.
  provider: string;
  // Human label, e.g. "Chase ****1234", "Wire to Bank of America",
  // "Visa ****4242", "Equity Trust IRA 9876", "0xabc…def".
  label: string;
  // Last four characters of the underlying number — bank / card last4,
  // wallet address last4, or IRA account last4. Backend redacts the
  // rest before returning.
  last4: string;
  // Currency / chain identifier. ISO 4217 for fiat, asset symbol for
  // stablecoins ("USDC", "USDT", "PYUSD").
  currency: string;
  status: PaymentMethodStatus;
  // True iff this method is the default for the named use.
  defaultForSettlement: boolean;
  defaultForDistributions: boolean;
  // Last-used timestamp for the activity column.
  lastUsedAt: ISODate | null;
  // For stablecoin wallets only — full on-chain address (rendered
  // truncated in the UI).
  onChainAddress?: string;
  // For ACH only — masked routing / account info already redacted on
  // the backend; safe to render.
  bankName?: string;
  // For wire only — instruction reference so the investor can pull a
  // printable instructions PDF.
  wireInstructionsRef?: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// AddPaymentMethodRequest is the unified create surface. The shape that
// matters per kind is enforced server-side; the browser only sends the
// fields the chosen kind requires.
export interface AddPaymentMethodRequest {
  kind: PaymentMethodKind;
  // ACH: { plaidPublicToken } | { routingNumber, accountNumber, accountType }
  // Card: { stripeSetupIntentClientSecret? } - the card itself is tokenised
  //        by Stripe Elements before submission; we never see the PAN.
  // Wire: nothing — the request creates a wire instructions packet.
  // IRA: { custodian, accountNumber, type }
  // Stablecoin: { walletProtocol: "walletconnect" | "luxmpc", address,
  //               chain, signature, signedMessage } - signature proves
  //               control of the address.
  payload: Record<string, string>;
}

// ---- market (Stage 10.5) ----------------------------------------------

export interface MarketOffering {
  id: string;
  // Human-readable name and short symbol used in the order book header.
  name: string;
  symbol: string;
  // Issuer + asset class context for the browse panel.
  issuer: string;
  assetClass: string;
  // Currency of trade prices and 24-h volume.
  currency: string;
  // Top-of-book snapshot.
  bestBid: string | null;
  bestAsk: string | null;
  lastTradePrice: string | null;
  lastTradeAt: ISODate | null;
  volume24h: string;
  // Whether this offering accepts new orders right now. Closed when the
  // venue is between sessions or when the issuer has paused secondary
  // trading.
  open: boolean;
  // Minimum increment and lot size — drives client-side rounding.
  tickSize: string;
  lotSize: string;
}

export type OrderBookSide = 'bid' | 'ask';

export interface OrderBookLevel {
  price: string;
  quantity: string;
  // Number of orders aggregated at this price level.
  orders: number;
}

export interface OrderBookSnapshot {
  offeringID: string;
  asOf: ISODate;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface TradePrint {
  id: string;
  offeringID: string;
  // Server-anonymised counterparty reference — e.g. "counterparty_a7c".
  counterpartyRef: string;
  side: OrderBookSide;
  price: string;
  quantity: string;
  executedAt: ISODate;
}

export type MarketOrderSide = 'buy' | 'sell';
export type MarketOrderType = 'limit'; // ATS time-price priority only
export type TimeInForce = 'day' | 'gtc' | 'ioc' | 'fok';

export type MarketOrderStatus =
  | 'pending_gate'
  | 'gate_denied'
  | 'gate_escalated'
  | 'open'
  | 'partially_filled'
  | 'filled'
  | 'cancelled'
  | 'rejected'
  | 'expired';

export interface MarketOrder {
  id: string;
  investorID: string;
  offeringID: string;
  offeringName: string;
  symbol: string;
  side: MarketOrderSide;
  type: MarketOrderType;
  timeInForce: TimeInForce;
  price: string;
  quantity: string;
  filledQuantity: string;
  status: MarketOrderStatus;
  // For status === 'gate_denied' | 'gate_escalated', the gate Decision is
  // returned so the user sees why and what to do.
  gateDecision?: GateDecision;
  rejectionReason?: string;
  submittedAt: ISODate;
  updatedAt: ISODate;
  // Set when the order finishes (filled / cancelled / expired / rejected).
  closedAt?: ISODate;
}

export interface PlaceOrderRequest {
  offeringID: string;
  side: MarketOrderSide;
  type: MarketOrderType;
  timeInForce: TimeInForce;
  price: string;
  quantity: string;
  // Optional client-side idempotency key. The gateway forwards as
  // Idempotency-Key; absent → derived deterministically server-side.
  clientOrderID?: string;
}

// PlaceOrderResponse: the gateway runs the G-37 pre-trade gate before
// forwarding the order to the broker router. If the gate denies, the
// returned MarketOrder has status === 'gate_denied' and `gateDecision`
// holds the reasons. If the gate allows, the order is in `open` (or
// further along) and `gateDecision` is omitted.
export interface PlaceOrderResponse {
  order: MarketOrder;
  // Server-confirmed Decision (always present) so the browser can render
  // the gate evaluation even on allow (for the audit panel).
  gateDecision: GateDecision;
}

// GateDecision mirrors broker/pkg/pretrade.Decision. The browser only
// reads it; never constructs it.
export interface GateDecision {
  allow: boolean;
  deny: boolean;
  escalate: boolean;
  reasons: GateReason[];
  requiredActions: string[];
  evaluatedAt: ISODate;
  // Round-trip latency (informational; rendered in the audit row).
  latencyNs: number;
}

export type GateSeverity = 'deny' | 'escalate';

export interface GateReason {
  code: string;
  severity: GateSeverity;
  message: string;
}

// ---- identity (Stage 10.7 + 10.8 + 10.9) ------------------------------

export type KYCStatus = 'verified' | 'pending' | 'stale' | 'rejected';
export type AccreditationMethod =
  | 'income'
  | 'net_worth'
  | 'professional'
  | 'entity'
  | 'self_cert'
  | 'third_party';
export type AccreditationStatus = 'verified' | 'pending' | 'stale' | 'expired';

export type W8FormType =
  | 'w8ben'
  | 'w8bene'
  | 'w8imy'
  | 'w8eci'
  | 'w8exp';
export type W9TaxClassification =
  | 'individual_sole_prop'
  | 'c_corp'
  | 's_corp'
  | 'partnership'
  | 'trust_estate'
  | 'llc';
export type TaxForm = W8FormType | 'w9';

export interface IdentityProfile {
  investorID: string;
  legalName: string;
  email: string;
  phone: string;
  // Postal / billing address.
  address: PostalAddress;
  countryOfTaxResidence: string;
  // Most-recent KYC pass.
  kyc: {
    status: KYCStatus;
    verifiedAt: ISODate | null;
    expiresAt: ISODate | null;
    provider: string;
  };
  // Accreditation snapshot.
  accreditation: {
    status: AccreditationStatus;
    method: AccreditationMethod | null;
    verifiedAt: ISODate | null;
    expiresAt: ISODate | null;
    isQualifiedPurchaser: boolean;
  };
  // Tax form on file.
  taxForm: {
    type: TaxForm;
    submittedAt: ISODate | null;
    expiresAt: ISODate | null;
    // For W-8 only — 3-year cycle, so this is the calendar date the
    // current form expires under Treasury Reg §1.1441-1(e)(4)(ii)(A).
    threeYearCycleExpiresAt: ISODate | null;
  };
  // Beneficiary / TOD designations on file (multiple permitted; sum-of-
  // shares must equal 1).
  beneficiaries: Beneficiary[];
  updatedAt: ISODate;
}

export interface PostalAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type BeneficiaryRelationship =
  | 'spouse'
  | 'child'
  | 'grandchild'
  | 'parent'
  | 'sibling'
  | 'trust'
  | 'charity'
  | 'other';

export type BeneficiaryStatus =
  | 'pending_dual_control'
  | 'active'
  | 'rejected'
  | 'superseded';

export interface Beneficiary {
  id: string;
  // Display label only — full identifier kept server-side. PII redaction
  // applied by the backend before returning.
  legalName: string;
  relationship: BeneficiaryRelationship;
  // Share of holdings on death-of-investor. Decimal string in [0,1]; sum
  // of all active beneficiaries must equal 1.
  share: string;
  dateOfBirth: ISODate | null;
  // ISO 3166-1 alpha-2 jurisdiction-of-residence — drives jurisdiction-
  // aware TOD law (community property / forced heirship).
  countryCode: string;
  status: BeneficiaryStatus;
  // Dual-control workflow case id when status === 'pending_dual_control'.
  dualControlCaseID?: string;
  submittedAt: ISODate;
  effectiveAt?: ISODate;
}

export interface KYCRefreshRequest {
  // US investors use the W-9 surface; non-US use the appropriate W-8.
  taxForm: TaxForm;
  // For W-9 — tax classification + TIN (already tokenised client-side
  // through a Stripe-equivalent for tax IDs; never sent in clear).
  w9?: {
    tinTokenized: string;
    classification: W9TaxClassification;
    backupWithholding: boolean;
  };
  // For W-8 — claim of treaty benefits + reduced withholding rate.
  w8?: {
    formType: W8FormType;
    foreignTIN: string;
    treatyCountry: string;
    treatyArticle: string;
    treatyRate: string; // decimal in [0,1]
  };
  // Refreshed PII: legal name + DOB + address.
  legalName: string;
  dateOfBirth: ISODate;
  address: PostalAddress;
}

export interface AccreditationRefreshRequest {
  method: AccreditationMethod;
  // Document IDs already uploaded via the document service. The browser
  // never PUTs documents through this endpoint — it pre-uploads.
  documentIDs: string[];
  // Self-attested income / net-worth bands when method is "income" or
  // "net_worth". Banded for privacy.
  incomeBand?: 'under_200k' | '200k_300k' | '300k_500k' | 'over_500k';
  netWorthBand?: 'under_1m' | '1m_5m' | '5m_25m' | 'over_25m';
  // True iff the investor is also asserting qualified-purchaser status
  // (3(c)(7), $5M investments threshold).
  qualifiedPurchaser?: boolean;
}

export interface W8RenewalRequest {
  formType: W8FormType;
  foreignTIN: string;
  treatyCountry: string;
  treatyArticle: string;
  treatyRate: string;
  // Beneficial-owner attestation under Treasury Reg §1.1441-1(e).
  attestation: boolean;
}

export interface AddressChangeRequest {
  address: PostalAddress;
  // Effective date for the address change. Today by default; future-dated
  // changes are allowed (queued in beneficial-owner workflow).
  effectiveAt: ISODate;
  // Reason for change (move / correction / legal-name / other) for audit.
  reason: 'move' | 'correction' | 'legal_name_change' | 'other';
}

export interface BeneficiaryUpsertRequest {
  // When updating an existing beneficiary, supply id; otherwise create.
  id?: string;
  legalName: string;
  relationship: BeneficiaryRelationship;
  share: string;
  dateOfBirth: ISODate;
  countryCode: string;
}

export interface BeneficiarySlate {
  beneficiaries: BeneficiaryUpsertRequest[];
}
