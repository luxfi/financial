// API route — /api/audit/export.csv
//
// Proxies the gateway's CSV export endpoint, attaching the identity headers
// the middleware injected. Streams text/csv back to the browser so the
// `ExportButton` client component can save it as a file.

import { NextResponse, type NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { env } from '@/lib/env';
import {
  CSV_HEADER,
  formatEntryForCSV,
  gateway,
  type AuditCategory,
  type AuditOutcome,
} from '@/lib/gateway';

export const dynamic = 'force-dynamic';

const CATEGORIES = new Set([
  'auth',
  'document',
  'trade',
  'withdrawal',
  'profile',
  'beneficiary',
  'kyc',
  'comms',
]);
const OUTCOMES = new Set(['success', 'failure', 'denied', 'pending']);

export async function GET(req: NextRequest): Promise<Response> {
  const sp = req.nextUrl.searchParams;
  const category = sp.get('category') ?? undefined;
  const outcome = sp.get('outcome') ?? undefined;
  const since = sp.get('since') ?? undefined;
  const until = sp.get('until') ?? undefined;

  const cat = category && CATEGORIES.has(category) ? (category as AuditCategory) : undefined;
  const out = outcome && OUTCOMES.has(outcome) ? (outcome as AuditOutcome) : undefined;

  // Confirm the request carries an authenticated identity. The middleware
  // attaches X-Lux-* headers; if they're missing the request never went
  // through middleware and we refuse.
  const h = await headers();
  if (!h.get('x-lux-investor-id') || !h.get('x-lux-tenant-id')) {
    return new NextResponse('unauthenticated', { status: 401 });
  }

  // Prefer the gateway's native CSV endpoint; on failure fall back to
  // serializing the JSON list locally.
  try {
    const csv = await gateway.audit.exportCSV({
      category: cat,
      outcome: out,
      since,
      until,
    });
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="lux-investor-activity.csv"`,
        'X-Gateway-Url': env.gatewayUrl,
      },
    });
  } catch {
    const page = await gateway.audit.list({
      category: cat,
      outcome: out,
      since,
      until,
      limit: 5000,
    });
    const body = [
      CSV_HEADER,
      ...page.entries.map(formatEntryForCSV),
    ].join('\n');
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="lux-investor-activity.csv"`,
      },
    });
  }
}
