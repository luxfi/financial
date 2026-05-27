// tax client — per-year folder of 1099 + K-1 docs plus the cost-basis
// report (FIFO / LIFO / specific-lot toggle, 8949-ready CSV export).
//
// 1099 forms are routed through the captable/tax iris + fire e-file
// adapters server-side; the investor portal only consumes the rendered
// PDFs and the structured lot data for the cost-basis calculator.
//
// Send-to-CPA mirrors the share-with-advisor pattern on the doc vault
// (scoped link gen, audit-logged).

import { callGateway } from './transport';
import type { ISODate, CostBasisLot } from './types';

// The nine 1099-family forms + Schedule K-1. Every form the captable/tax
// service can issue maps to one of these.
export type TaxFormType =
  | '1099-DIV'
  | '1099-B'
  | '1099-INT'
  | '1099-MISC'
  | '1099-NEC'
  | '1099-OID'
  | '1099-K'
  | '1099-R'
  | 'K-1';

export interface TaxFormRow {
  id: string;
  taxYear: number;
  formType: TaxFormType;
  payerName: string;
  // Last 4 of TIN — never the full TIN over the wire.
  recipientTinLast4: string;
  // Status mirrors captable/tax Form1099*.Status: draft / generated /
  // filed / corrected.
  status: 'draft' | 'generated' | 'filed' | 'corrected';
  generatedAt: ISODate | null;
  // Bytes for client-side row display.
  sizeBytes: number;
  // Manifest SHA-256 from the WORM seal of the rendered PDF.
  sha256: string;
}

export interface TaxYearFolder {
  taxYear: number;
  forms: TaxFormRow[];
  // Convenience aggregates the page header surfaces.
  formCount: number;
  totalOrdinaryIncome: string;
  totalCapitalGain: string;
  currency: string;
}

export interface TaxFormBody {
  bodyBase64: string;
  contentType: string;
  sha256: string;
  filename: string;
  auditEventID: string;
}

// CostBasis report — per-lot detail for Form 8949.
export type CostBasisMethod = 'fifo' | 'lifo' | 'specific';

export interface CostBasisLine {
  lotID: string;
  securityID: string;
  securityName: string;
  acquiredDate: ISODate;
  dateSold: ISODate | null;
  quantity: string;
  costPerShare: string;
  totalCostBasis: string;
  // Sold lots — proceeds + realized gain/loss.
  proceeds: string | null;
  realizedGainLoss: string | null;
  // "short" iff held < 365d, else "long". Null while still open.
  term: 'short' | 'long' | null;
  // Optional wash-sale flag the captable/tax service computes.
  washSale: boolean;
}

export interface CostBasisReport {
  taxYear: number;
  method: CostBasisMethod;
  lines: CostBasisLine[];
  totalProceeds: string;
  totalCostBasis: string;
  shortTermGainLoss: string;
  longTermGainLoss: string;
  currency: string;
}

export interface SendToCpaRequest {
  formIDs: string[];
  // Optional cost-basis report inclusion.
  includeCostBasis: boolean;
  taxYear: number;
  cpaEmail: string;
  cpaName?: string;
  expiresAt: ISODate;
}

export interface SendToCpaResult {
  url: string;
  expiresAt: ISODate;
  formCount: number;
  auditEventID: string;
}

export const tax = {
  // listYears returns the tax years the authenticated investor has at
  // least one form in. Descending.
  async listYears(): Promise<number[]> {
    return callGateway<number[]>({
      service: 'captable',
      path: '/tax/years',
    });
  },

  // folder returns the index for one tax year (1099s + K-1s).
  async folder(taxYear: number): Promise<TaxYearFolder> {
    return callGateway<TaxYearFolder>({
      service: 'captable',
      path: `/tax/${taxYear}`,
    });
  },

  // formBody pulls the rendered PDF of one form. Audit-logged.
  async formBody(formID: string): Promise<TaxFormBody> {
    return callGateway<TaxFormBody>({
      service: 'captable',
      path: `/tax/forms/${encodeURIComponent(formID)}/body`,
    });
  },

  // costBasis computes the per-lot report under the named aggregation
  // method.
  async costBasis(
    taxYear: number,
    method: CostBasisMethod = 'fifo',
  ): Promise<CostBasisReport> {
    return callGateway<CostBasisReport>({
      service: 'captable',
      path: '/tax/cost-basis',
      query: { tax_year: taxYear, method },
    });
  },

  // costBasisCsv returns 8949-ready CSV (string) of the same report.
  async costBasisCsv(
    taxYear: number,
    method: CostBasisMethod = 'fifo',
  ): Promise<string> {
    return callGateway<string>({
      service: 'captable',
      path: '/tax/cost-basis.csv',
      query: { tax_year: taxYear, method },
    });
  },

  // sendToCpa generates a scoped link the investor hands to their CPA.
  async sendToCpa(req: SendToCpaRequest): Promise<SendToCpaResult> {
    return callGateway<SendToCpaResult>({
      service: 'captable',
      method: 'POST',
      path: '/tax/send-to-cpa',
      body: req,
    });
  },
};

// CSV serialiser used by the 8949 export. Kept here so tests can call it
// against a fixed CostBasisReport without round-tripping the gateway.
export function costBasisToCsv8949(report: CostBasisReport): string {
  const header = [
    'Description',
    'Date acquired',
    'Date sold',
    'Proceeds',
    'Cost basis',
    'Gain or loss',
    'Term',
    'Wash sale',
  ].join(',');

  const lines = report.lines
    .filter((l) => l.dateSold !== null && l.proceeds !== null)
    .map((l) =>
      [
        csvEscape(`${l.securityName} (${l.quantity})`),
        l.acquiredDate,
        l.dateSold ?? '',
        l.proceeds ?? '',
        l.totalCostBasis,
        l.realizedGainLoss ?? '',
        l.term ?? '',
        l.washSale ? 'Y' : 'N',
      ].join(','),
    );

  return [header, ...lines].join('\n');
}

function csvEscape(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// Re-export CostBasisLot from the shared types so callers don't need to
// import from two paths.
export type { CostBasisLot };

export const TAX_FORM_LABEL: Record<TaxFormType, string> = {
  '1099-DIV': '1099-DIV — Dividends',
  '1099-B': '1099-B — Broker proceeds',
  '1099-INT': '1099-INT — Interest income',
  '1099-MISC': '1099-MISC — Miscellaneous',
  '1099-NEC': '1099-NEC — Nonemployee comp',
  '1099-OID': '1099-OID — Original issue discount',
  '1099-K': '1099-K — Payment cards / network',
  '1099-R': '1099-R — Retirement distributions',
  'K-1': 'Schedule K-1 — Partner share',
};
