// audit client — Stage 10.10 investor-initiated activity log.
//
// Backed by the gateway's /v1/audit endpoint which fans out to each backend's
// audit sink (luxfi/transfer/pkg/worm AuditLog, broker's audit, treasury's
// transaction journal, captable's stakeholder events). The gateway filters
// every record by investor_id + tenant_id before returning to the browser.

import { callGateway } from './transport';
import type {
  AuditCategory,
  AuditEntry,
  AuditOutcome,
  AuditPage,
} from './types';

export interface AuditQuery {
  category?: AuditCategory;
  outcome?: AuditOutcome;
  since?: string;
  until?: string;
  cursor?: string;
  limit?: number;
}

export const audit = {
  // list returns one filtered page of audit entries.
  async list(q: AuditQuery = {}): Promise<AuditPage> {
    return callGateway<AuditPage>({
      service: 'audit',
      path: '/entries',
      query: {
        category: q.category,
        outcome: q.outcome,
        since: q.since,
        until: q.until,
        cursor: q.cursor,
        limit: q.limit,
      },
    });
  },

  // exportCSV streams the full filtered range as a CSV blob.
  // This route is rendered by the API route /api/audit/export which calls
  // through the gateway with the same scope and serializes to text/csv.
  async exportCSV(q: Omit<AuditQuery, 'cursor' | 'limit'>): Promise<string> {
    return callGateway<string>({
      service: 'audit',
      path: '/entries.csv',
      query: {
        category: q.category,
        outcome: q.outcome,
        since: q.since,
        until: q.until,
      },
    });
  },
};

// formatEntryForCSV serializes one entry to a CSV row. Used by the client-side
// fallback exporter when the gateway export endpoint is unavailable.
export function formatEntryForCSV(e: AuditEntry): string {
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
  return [
    e.ts,
    e.category,
    e.action,
    e.outcome,
    e.target,
    e.ip,
    e.userAgent,
    e.description,
    e.err ?? '',
  ]
    .map((v) => escape(String(v ?? '')))
    .join(',');
}

export const CSV_HEADER =
  'timestamp,category,action,outcome,target,ip,user_agent,description,error';
