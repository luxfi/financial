// Typed client hooks for each backend.
// Every hook throws Error("not implemented — wire to <bankd|forexd|...>")
// until the upstream service is reachable. No silent stubs.

import { env } from "./env";

class NotWiredError extends Error {
  constructor(service: string) {
    super(`not implemented — wire to ${service}`);
    this.name = "NotWiredError";
  }
}

function requireUrl(url: string, service: string): string {
  if (!url) throw new NotWiredError(service);
  return url;
}

export interface AccountBalance {
  currency: string;
  available: string;
  pending: string;
}

export interface Card {
  id: string;
  last4: string;
  brand: string;
  status: "active" | "frozen" | "cancelled";
  type: "virtual" | "physical";
}

export interface CryptoBalance {
  asset: string;
  amount: string;
  fiatValue: string;
}

export interface FxQuote {
  pair: string;
  rate: string;
  expiresAt: string;
  quoteId: string;
}

export interface ComplianceState {
  kycLevel: 0 | 1 | 2 | 3;
  status: "none" | "pending" | "approved" | "rejected";
  documents: { type: string; status: string }[];
}

// --- bankd ---
export async function listAccounts(): Promise<AccountBalance[]> {
  requireUrl(env.bankApiUrl, "bankd");
  throw new NotWiredError("bankd");
}

export async function sendTransfer(_input: {
  from: string;
  to: string;
  amount: string;
  rail: "swift" | "sepa" | "fedwire" | "fednow" | "ach" | "internal";
}): Promise<{ id: string }> {
  requireUrl(env.bankApiUrl, "bankd");
  throw new NotWiredError("bankd");
}

// --- cardd (under bankd) ---
export async function listCards(): Promise<Card[]> {
  requireUrl(env.bankApiUrl, "bankd");
  throw new NotWiredError("bankd");
}

export async function issueCard(_input: { type: "virtual" | "physical" }): Promise<Card> {
  requireUrl(env.bankApiUrl, "bankd");
  throw new NotWiredError("bankd");
}

// --- brokerd (crypto) ---
export async function listCryptoBalances(): Promise<CryptoBalance[]> {
  requireUrl(env.brokerApiUrl, "brokerd");
  throw new NotWiredError("brokerd");
}

export async function sendCrypto(_input: {
  asset: string;
  to: string;
  amount: string;
}): Promise<{ txid: string }> {
  requireUrl(env.bridgeApiUrl, "bridged");
  throw new NotWiredError("bridged");
}

// --- forexd ---
export async function quoteFx(_input: { pair: string; amount: string }): Promise<FxQuote> {
  requireUrl(env.forexApiUrl, "forexd");
  throw new NotWiredError("forexd");
}

export async function executeFx(_quoteId: string): Promise<{ id: string }> {
  requireUrl(env.forexApiUrl, "forexd");
  throw new NotWiredError("forexd");
}

// --- treasuryd (compliance/kyc) ---
export async function getComplianceState(): Promise<ComplianceState> {
  requireUrl(env.treasuryApiUrl, "treasuryd");
  throw new NotWiredError("treasuryd");
}

export async function uploadKycDocument(_input: {
  type: string;
  file: File;
}): Promise<{ id: string }> {
  requireUrl(env.treasuryApiUrl, "treasuryd");
  throw new NotWiredError("treasuryd");
}
