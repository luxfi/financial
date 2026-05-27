// document client — investor-scoped read of the document vault. Every
// Document in the index is sourced from a luxfi/transfer worm.Store
// object behind the gateway; the manifest SHA-256 is part of the listing
// so the browser can re-verify integrity on Get without trusting the
// transport.
//
// Categories surfaced (per gap analysis G-22 Stage 10.2):
//
//   subscription_agreement, k1, 1099, annual_report, side_letter,
//   offering_memorandum, custody_statement
//
// Share-with-advisor produces a time-limited, audit-logged URL the
// investor hands to their lawyer / accountant; the URL embeds an opaque
// share token the gateway resolves to a scoped read grant.

import { callGateway } from './transport';
import type { ISODate } from './types';

export type DocumentCategory =
  | 'subscription_agreement'
  | 'k1'
  | 'tax_form_1099'
  | 'annual_report'
  | 'side_letter'
  | 'offering_memorandum'
  | 'custody_statement';

export interface DocumentRow {
  id: string;
  name: string;
  // Free-form doc type (the captable Document.Type field).
  docType: string;
  category: DocumentCategory;
  issuedBy: string;
  issuedDate: ISODate;
  sizeBytes: number;
  mimeType: string;
  // Hex-encoded SHA-256 of the body as sealed under WORM. The browser
  // re-hashes on Get and compares.
  sha256: string;
  // RetainUntil from the WORM manifest. Surface for the investor so they
  // know how long the doc is regulator-retained.
  retainUntil: ISODate;
  // Optional offering / security context for filtering.
  offeringID?: string;
  offeringName?: string;
}

export interface DocumentBody {
  // Base64-encoded body. We deliberately stay JSON over the gateway so
  // the same fetch path serves every other client; binary streaming is a
  // future optimisation.
  bodyBase64: string;
  contentType: string;
  // SHA-256 the gateway recomputed at Get time, mirroring the WORM
  // Verify check.
  sha256: string;
  filename: string;
  // The WORM audit event ID created on this read. Returned so the
  // browser can correlate failures back to the audit-log entry.
  auditEventID: string;
}

export interface ShareLink {
  url: string;
  expiresAt: ISODate;
  scope: 'view' | 'download';
  // The audit event ID of the share-grant creation.
  auditEventID: string;
}

export interface ShareRequest {
  documentID: string;
  recipientEmail: string;
  // ISO-8601 expiry. The gateway enforces a maximum (default: 14 days).
  expiresAt: ISODate;
  scope?: 'view' | 'download';
  // Free-form note attached to the share email (lawyer / accountant
  // context).
  note?: string;
}

export const document = {
  // list returns the full document index for the authenticated investor.
  // Filterable by category and free-text search.
  async list(opts?: {
    category?: DocumentCategory;
    search?: string;
    offeringID?: string;
  }): Promise<DocumentRow[]> {
    return callGateway<DocumentRow[]>({
      service: 'captable',
      path: '/documents',
      query: {
        category: opts?.category,
        q: opts?.search,
        offering_id: opts?.offeringID,
      },
    });
  },

  // get pulls the body of a single document. The gateway records a WORM
  // read audit-event before responding. The returned manifest SHA-256
  // MUST be re-verified by the caller (see lib/worm/sha256.ts).
  async get(documentID: string): Promise<DocumentBody> {
    return callGateway<DocumentBody>({
      service: 'captable',
      path: `/documents/${encodeURIComponent(documentID)}/body`,
    });
  },

  // share creates a scoped, time-limited link. Returns the URL the
  // investor hands to their advisor. The share grant is audit-logged.
  async share(req: ShareRequest): Promise<ShareLink> {
    return callGateway<ShareLink>({
      service: 'captable',
      method: 'POST',
      path: '/documents/share',
      body: req,
    });
  },
};

// Static category metadata for the UI tree view. Kept in one place so the
// labels can be re-themed by white-label without touching the page code.
export const DOCUMENT_CATEGORIES: Array<{
  id: DocumentCategory;
  label: string;
  description: string;
}> = [
  {
    id: 'subscription_agreement',
    label: 'Subscription agreements',
    description: 'Executed subscription docs for every offering',
  },
  {
    id: 'k1',
    label: 'Schedule K-1',
    description: 'Partner share of income — annual',
  },
  {
    id: 'tax_form_1099',
    label: '1099 forms',
    description: 'DIV / B / INT / MISC / NEC / OID / K / R',
  },
  {
    id: 'annual_report',
    label: 'Annual reports',
    description: 'Issuer-prepared annual reports + audited financials',
  },
  {
    id: 'side_letter',
    label: 'Side letters',
    description: 'Bespoke rights letters (info / MFN / fee tiers)',
  },
  {
    id: 'offering_memorandum',
    label: 'Offering memoranda',
    description: 'PPM / offering circulars for every position',
  },
  {
    id: 'custody_statement',
    label: 'Custody statements',
    description: 'Periodic statements from the qualified custodian',
  },
];
