import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// next/headers is a runtime-only module; we stub it before importing the
// transport so callGateway sees a deterministic identity context.
vi.mock('next/headers', () => ({
  headers: async () =>
    new Headers({
      'x-lux-sub': 'sub_x',
      'x-lux-investor-id': 'inv_x',
      'x-lux-tenant-id': 't_x',
    }),
}));

import { callGateway, GatewayError } from '@/lib/gateway/transport';

describe('callGateway', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn() as unknown as typeof fetch;
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('builds the gateway URL with the service prefix and identity headers', async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const result = await callGateway<{ ok: boolean }>({
      service: 'captable',
      path: '/positions',
      query: { method: 'fifo' },
    });
    expect(result).toEqual({ ok: true });

    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    const [calledUrl, init] = fetchMock.mock.calls[0];
    expect(String(calledUrl)).toContain('/v1/captable/positions');
    expect(String(calledUrl)).toContain('method=fifo');
    const h = (init as RequestInit).headers as Record<string, string>;
    expect(h['X-Lux-Investor-Id']).toBe('inv_x');
    expect(h['X-Lux-Tenant-Id']).toBe('t_x');
    expect(h['X-Lux-Sub']).toBe('sub_x');
  });

  it('throws GatewayError on a non-2xx response', async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'forbidden' }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      }),
    );
    await expect(
      callGateway({ service: 'broker', path: '/orders' }),
    ).rejects.toBeInstanceOf(GatewayError);
  });

  it('returns undefined on 204 No Content', async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response(null, { status: 204 }),
    );
    const v = await callGateway({ service: 'treasury', path: '/x', method: 'DELETE' });
    expect(v).toBeUndefined();
  });

  it('serializes a JSON body with content-type', async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } }),
    );
    await callGateway({
      service: 'transfer',
      path: '/x',
      method: 'POST',
      body: { foo: 'bar' },
    });
    const [, init] = (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(((init as RequestInit).headers as Record<string, string>)['Content-Type']).toBe(
      'application/json',
    );
    expect(String((init as RequestInit).body)).toContain('"foo":"bar"');
  });
});
