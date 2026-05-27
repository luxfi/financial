// Test + dev fixtures. These exist so the per-route server components can
// be unit-rendered without a live gateway. Routes never import this
// directly — only the __tests__/ suite does.

import type {
  Beneficiary,
  GateDecision,
  IdentityProfile,
  MarketOffering,
  MarketOrder,
  OrderBookSnapshot,
  PaymentMethod,
  PlaceOrderResponse,
  TradePrint,
} from './types';

export function mockPaymentMethods(): PaymentMethod[] {
  return [
    {
      id: 'pm_ach_001',
      investorID: 'inv_test_001',
      tenantID: 'tenant_test_001',
      kind: 'ach',
      provider: 'plaid',
      label: 'Chase ****1234',
      last4: '1234',
      currency: 'USD',
      status: 'verified',
      defaultForSettlement: true,
      defaultForDistributions: true,
      lastUsedAt: '2026-04-12T18:31:00Z',
      bankName: 'JPMorgan Chase',
      createdAt: '2024-11-02T10:00:00Z',
      updatedAt: '2026-04-12T18:31:00Z',
    },
    {
      id: 'pm_card_001',
      investorID: 'inv_test_001',
      tenantID: 'tenant_test_001',
      kind: 'card',
      provider: 'stripe',
      label: 'Visa ****4242',
      last4: '4242',
      currency: 'USD',
      status: 'verified',
      defaultForSettlement: false,
      defaultForDistributions: false,
      lastUsedAt: '2026-02-08T12:14:00Z',
      createdAt: '2025-07-19T10:00:00Z',
      updatedAt: '2026-02-08T12:14:00Z',
    },
    {
      id: 'pm_ach_002',
      investorID: 'inv_test_001',
      tenantID: 'tenant_test_001',
      kind: 'ach',
      provider: 'moderntreasury',
      label: 'BofA ****9911',
      last4: '9911',
      currency: 'USD',
      status: 'pending_micro_deposits',
      defaultForSettlement: false,
      defaultForDistributions: false,
      lastUsedAt: null,
      bankName: 'Bank of America',
      createdAt: '2026-05-22T09:00:00Z',
      updatedAt: '2026-05-22T09:00:00Z',
    },
    {
      id: 'pm_wire_001',
      investorID: 'inv_test_001',
      tenantID: 'tenant_test_001',
      kind: 'wire',
      provider: 'moderntreasury',
      label: 'Wire to Citi (settlement)',
      last4: '0001',
      currency: 'USD',
      status: 'verified',
      defaultForSettlement: false,
      defaultForDistributions: false,
      lastUsedAt: '2026-03-30T14:50:00Z',
      wireInstructionsRef: 'WIRE-2026-INV-001',
      createdAt: '2024-05-01T10:00:00Z',
      updatedAt: '2026-03-30T14:50:00Z',
    },
    {
      id: 'pm_ira_001',
      investorID: 'inv_test_001',
      tenantID: 'tenant_test_001',
      kind: 'ira',
      provider: 'northcapital',
      label: 'Equity Trust IRA ****8732',
      last4: '8732',
      currency: 'USD',
      status: 'verified',
      defaultForSettlement: false,
      defaultForDistributions: false,
      lastUsedAt: '2026-01-15T10:00:00Z',
      createdAt: '2025-03-04T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'pm_sc_001',
      investorID: 'inv_test_001',
      tenantID: 'tenant_test_001',
      kind: 'stablecoin',
      provider: 'walletconnect',
      label: 'USDC 0xab12…ef34',
      last4: 'ef34',
      currency: 'USDC',
      status: 'verified',
      defaultForSettlement: false,
      defaultForDistributions: false,
      lastUsedAt: '2026-05-01T08:21:00Z',
      onChainAddress: '0xab12cd34ef56789012345678901234567890ef34',
      createdAt: '2025-12-12T10:00:00Z',
      updatedAt: '2026-05-01T08:21:00Z',
    },
  ];
}

export function mockOfferings(): MarketOffering[] {
  return [
    {
      id: 'off_lux_pref_a',
      name: 'Lux Preferred Series A',
      symbol: 'LUX.PRA',
      issuer: 'Lux Financial, Inc.',
      assetClass: 'preferred_equity',
      currency: 'USD',
      bestBid: '102.50',
      bestAsk: '103.10',
      lastTradePrice: '102.80',
      lastTradeAt: '2026-05-24T19:55:00Z',
      volume24h: '482000',
      open: true,
      tickSize: '0.01',
      lotSize: '1',
    },
    {
      id: 'off_rwa_uran_24',
      name: 'Uranium Royalty Note 2024',
      symbol: 'URN.RN24',
      issuer: 'Creatrust SPV-7',
      assetClass: 'royalty_note',
      currency: 'USD',
      bestBid: '98.20',
      bestAsk: '98.95',
      lastTradePrice: '98.55',
      lastTradeAt: '2026-05-25T16:02:00Z',
      volume24h: '123500',
      open: true,
      tickSize: '0.05',
      lotSize: '10',
    },
    {
      id: 'off_re_nnn_3',
      name: 'NNN-SPV Real Estate 3',
      symbol: 'RE.NNN3',
      issuer: 'Lux Real Estate SPV-3',
      assetClass: 'real_estate',
      currency: 'USD',
      bestBid: '1014.00',
      bestAsk: '1020.00',
      lastTradePrice: '1017.50',
      lastTradeAt: '2026-05-22T15:30:00Z',
      volume24h: '32000',
      open: false,
      tickSize: '0.50',
      lotSize: '1',
    },
  ];
}

export function mockOrderBook(offeringID: string): OrderBookSnapshot {
  return {
    offeringID,
    asOf: '2026-05-25T20:00:00Z',
    bids: [
      { price: '102.50', quantity: '1500', orders: 4 },
      { price: '102.40', quantity: '2200', orders: 6 },
      { price: '102.30', quantity: '3000', orders: 3 },
      { price: '102.20', quantity: '1800', orders: 2 },
      { price: '102.10', quantity: '900', orders: 1 },
    ],
    asks: [
      { price: '103.10', quantity: '1200', orders: 3 },
      { price: '103.20', quantity: '1800', orders: 5 },
      { price: '103.30', quantity: '2500', orders: 4 },
      { price: '103.40', quantity: '1100', orders: 2 },
      { price: '103.50', quantity: '700', orders: 1 },
    ],
  };
}

export function mockTradeHistory(offeringID: string): TradePrint[] {
  return [
    {
      id: 'trd_001',
      offeringID,
      counterpartyRef: 'counterparty_a7c',
      side: 'bid',
      price: '102.80',
      quantity: '500',
      executedAt: '2026-05-24T19:55:00Z',
    },
    {
      id: 'trd_002',
      offeringID,
      counterpartyRef: 'counterparty_b21',
      side: 'ask',
      price: '102.85',
      quantity: '300',
      executedAt: '2026-05-24T19:42:00Z',
    },
    {
      id: 'trd_003',
      offeringID,
      counterpartyRef: 'counterparty_c4d',
      side: 'bid',
      price: '102.75',
      quantity: '1200',
      executedAt: '2026-05-24T18:31:00Z',
    },
  ];
}

export function mockMyOrders(): MarketOrder[] {
  return [
    {
      id: 'ord_001',
      investorID: 'inv_test_001',
      offeringID: 'off_lux_pref_a',
      offeringName: 'Lux Preferred Series A',
      symbol: 'LUX.PRA',
      side: 'buy',
      type: 'limit',
      timeInForce: 'gtc',
      price: '102.50',
      quantity: '100',
      filledQuantity: '0',
      status: 'open',
      submittedAt: '2026-05-25T09:00:00Z',
      updatedAt: '2026-05-25T09:00:00Z',
    },
    {
      id: 'ord_002',
      investorID: 'inv_test_001',
      offeringID: 'off_rwa_uran_24',
      offeringName: 'Uranium Royalty Note 2024',
      symbol: 'URN.RN24',
      side: 'sell',
      type: 'limit',
      timeInForce: 'day',
      price: '99.00',
      quantity: '500',
      filledQuantity: '250',
      status: 'partially_filled',
      submittedAt: '2026-05-25T14:30:00Z',
      updatedAt: '2026-05-25T18:11:00Z',
    },
  ];
}

export function mockGateAllow(): GateDecision {
  return {
    allow: true,
    deny: false,
    escalate: false,
    reasons: [],
    requiredActions: [],
    evaluatedAt: '2026-05-25T20:01:00Z',
    latencyNs: 4_200_000,
  };
}

export function mockGateDeny(): GateDecision {
  return {
    allow: false,
    deny: true,
    escalate: false,
    reasons: [
      {
        code: 'accreditation_stale',
        severity: 'deny',
        message:
          'Accreditation last verified 412 days ago; max age is 365 days.',
      },
      {
        code: 'ofac_screen_stale',
        severity: 'deny',
        message: 'OFAC screen last run 47 days ago; cycle is 30 days.',
      },
    ],
    requiredActions: ['renew_accreditation', 'request_ofac_rescreen'],
    evaluatedAt: '2026-05-25T20:01:00Z',
    latencyNs: 6_900_000,
  };
}

export function mockGateEscalate(): GateDecision {
  return {
    allow: false,
    deny: false,
    escalate: true,
    reasons: [
      {
        code: 'accreditation_near_expiry',
        severity: 'escalate',
        message: 'Accreditation expires in 11 days; review recommended.',
      },
    ],
    requiredActions: ['review_with_advisor'],
    evaluatedAt: '2026-05-25T20:01:00Z',
    latencyNs: 5_100_000,
  };
}

export function mockPlaceOrderAllow(): PlaceOrderResponse {
  const decision = mockGateAllow();
  return {
    order: {
      id: 'ord_new_001',
      investorID: 'inv_test_001',
      offeringID: 'off_lux_pref_a',
      offeringName: 'Lux Preferred Series A',
      symbol: 'LUX.PRA',
      side: 'buy',
      type: 'limit',
      timeInForce: 'gtc',
      price: '102.50',
      quantity: '100',
      filledQuantity: '0',
      status: 'open',
      gateDecision: decision,
      submittedAt: decision.evaluatedAt,
      updatedAt: decision.evaluatedAt,
    },
    gateDecision: decision,
  };
}

export function mockPlaceOrderDeny(): PlaceOrderResponse {
  const decision = mockGateDeny();
  return {
    order: {
      id: 'ord_new_002',
      investorID: 'inv_test_001',
      offeringID: 'off_lux_pref_a',
      offeringName: 'Lux Preferred Series A',
      symbol: 'LUX.PRA',
      side: 'buy',
      type: 'limit',
      timeInForce: 'gtc',
      price: '102.50',
      quantity: '100',
      filledQuantity: '0',
      status: 'gate_denied',
      gateDecision: decision,
      submittedAt: decision.evaluatedAt,
      updatedAt: decision.evaluatedAt,
      closedAt: decision.evaluatedAt,
    },
    gateDecision: decision,
  };
}

export function mockPlaceOrderEscalate(): PlaceOrderResponse {
  const decision = mockGateEscalate();
  return {
    order: {
      id: 'ord_new_003',
      investorID: 'inv_test_001',
      offeringID: 'off_lux_pref_a',
      offeringName: 'Lux Preferred Series A',
      symbol: 'LUX.PRA',
      side: 'buy',
      type: 'limit',
      timeInForce: 'gtc',
      price: '102.50',
      quantity: '100',
      filledQuantity: '0',
      status: 'gate_escalated',
      gateDecision: decision,
      submittedAt: decision.evaluatedAt,
      updatedAt: decision.evaluatedAt,
    },
    gateDecision: decision,
  };
}

export function mockIdentityProfile(): IdentityProfile {
  return {
    investorID: 'inv_test_001',
    legalName: 'Jane Q. Investor',
    email: 'jane@investor.test',
    phone: '+1-415-555-0100',
    address: {
      line1: '500 Market St',
      line2: 'Suite 4500',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94104',
      country: 'US',
    },
    countryOfTaxResidence: 'US',
    kyc: {
      status: 'stale',
      verifiedAt: '2023-11-12T10:00:00Z',
      expiresAt: '2025-11-12T10:00:00Z',
      provider: 'northcapital',
    },
    accreditation: {
      status: 'verified',
      method: 'net_worth',
      verifiedAt: '2025-09-04T10:00:00Z',
      expiresAt: '2026-09-04T10:00:00Z',
      isQualifiedPurchaser: false,
    },
    taxForm: {
      type: 'w9',
      submittedAt: '2024-02-01T10:00:00Z',
      expiresAt: null,
      threeYearCycleExpiresAt: null,
    },
    beneficiaries: [
      {
        id: 'bene_001',
        legalName: 'John Investor',
        relationship: 'spouse',
        share: '1.00',
        dateOfBirth: '1975-04-12',
        countryCode: 'US',
        status: 'active',
        submittedAt: '2024-12-01T10:00:00Z',
        effectiveAt: '2024-12-01T10:00:00Z',
      },
    ],
    updatedAt: '2026-05-25T19:00:00Z',
  };
}

export function mockIdentityProfileForeign(): IdentityProfile {
  return {
    investorID: 'inv_test_002',
    legalName: 'Akira Tanaka',
    email: 'akira@example.jp',
    phone: '+81-3-5555-0100',
    address: {
      line1: '1-1-1 Marunouchi',
      city: 'Chiyoda',
      state: 'Tokyo',
      postalCode: '100-0005',
      country: 'JP',
    },
    countryOfTaxResidence: 'JP',
    kyc: {
      status: 'verified',
      verifiedAt: '2025-06-20T10:00:00Z',
      expiresAt: '2027-06-20T10:00:00Z',
      provider: 'northcapital',
    },
    accreditation: {
      status: 'verified',
      method: 'entity',
      verifiedAt: '2025-09-01T10:00:00Z',
      expiresAt: '2026-09-01T10:00:00Z',
      isQualifiedPurchaser: true,
    },
    taxForm: {
      type: 'w8ben',
      submittedAt: '2023-04-01T10:00:00Z',
      expiresAt: '2026-12-31T23:59:59Z',
      threeYearCycleExpiresAt: '2026-12-31T23:59:59Z',
    },
    beneficiaries: [],
    updatedAt: '2026-05-25T19:00:00Z',
  };
}

export function mockBeneficiaries(): Beneficiary[] {
  return mockIdentityProfile().beneficiaries;
}
