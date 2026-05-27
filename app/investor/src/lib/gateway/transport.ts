// Gateway transport. One typed fetch helper that:
//
//  * Always calls through the operator gateway, never a backend directly.
//  * Forwards identity headers (sub / investor / tenant) so the gateway can
//    enforce scope.
//  * Surfaces typed errors. Never returns silently on a non-2xx.
//
// All four service clients (captable / transfer / treasury / broker) sit on
// top of this transport — the gateway routes by URL prefix.

import { env } from '../env';

// next/headers is server-only. We lazy-import it so the module graph doesn't
// poison client-component bundles unless they actually exercise this path
// at runtime. Calls from a client component must instead go through a
// server action or API route; the import below will throw in that case
// because the runtime is the browser.
type NextHeadersFn = () => Promise<Headers> | Headers;
let _headersFn: NextHeadersFn | null = null;
async function getHeadersFn(): Promise<NextHeadersFn> {
  if (_headersFn) return _headersFn;
  const mod = (await import('next/headers')) as unknown as {
    headers: NextHeadersFn;
  };
  _headersFn = mod.headers;
  return _headersFn;
}

export class GatewayError extends Error {
  readonly status: number;
  readonly service: string;
  readonly body: unknown;
  constructor(service: string, status: number, body: unknown, message: string) {
    super(`${service} gateway error ${status}: ${message}`);
    this.name = 'GatewayError';
    this.status = status;
    this.service = service;
    this.body = body;
  }
}

export interface RequestOptions {
  // Service this call belongs to. Used for URL routing + error context.
  service: 'captable' | 'transfer' | 'treasury' | 'broker' | 'auth' | 'audit';
  // HTTP method.
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  // Path under the service (begins with '/').
  path: string;
  // Query parameters.
  query?: Record<string, string | number | boolean | undefined>;
  // JSON body (if any).
  body?: unknown;
  // Override fetch signal (e.g. for AbortController).
  signal?: AbortSignal;
}

// callGateway executes one request through the operator gateway. Server-only —
// reads the identity headers Next set on the request via middleware, and
// forwards them as X-Lux-* to the gateway.
export async function callGateway<T>(opts: RequestOptions): Promise<T> {
  const fn = await getHeadersFn();
  const h = await fn();
  const investorID = h.get('x-lux-investor-id') ?? '';
  const tenantID = h.get('x-lux-tenant-id') ?? '';
  const sub = h.get('x-lux-sub') ?? '';

  const url = new URL(`/v1/${opts.service}${opts.path}`, env.gatewayUrl);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Lux-Investor-Id': investorID,
    'X-Lux-Tenant-Id': tenantID,
    'X-Lux-Sub': sub,
  };
  let body: BodyInit | undefined;
  if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(url.toString(), {
    method: opts.method ?? 'GET',
    headers,
    body,
    signal: opts.signal,
    cache: 'no-store',
  });

  if (!res.ok) {
    let parsed: unknown;
    try {
      parsed = await res.json();
    } catch {
      parsed = await res.text().catch(() => '');
    }
    const msg = typeof parsed === 'object' && parsed !== null && 'message' in parsed
      ? String((parsed as { message: unknown }).message)
      : res.statusText;
    throw new GatewayError(opts.service, res.status, parsed, msg);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}
