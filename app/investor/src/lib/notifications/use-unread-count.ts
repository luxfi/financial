'use client';

// useUnreadCount — shared hook the main shell consumes to render the
// inbox badge. Other portal sections may also subscribe if they grow
// their own badge surfaces.
//
// Contract:
//
//   const { counts, refresh, loading, error } = useUnreadCount();
//
// counts.total — the integer to render in the badge.
// refresh — call after any optimistic write (mark-read, ack) to re-pull.
//
// The hook polls every 60s when the page is visible; pauses when hidden.
//
// Consumed by:
//   * components/shell/Sidebar.tsx — renders the inbox badge.
//   * app/(authed)/inbox/InboxView.tsx — refreshes after mark-read /
//     acknowledge so the badge updates without waiting on the poll.

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UnreadCounts {
  total: number;
  byType: Record<string, number>;
  latestAt: string | null;
}

const EMPTY_COUNTS: UnreadCounts = {
  total: 0,
  byType: {},
  latestAt: null,
};

const POLL_MS = 60_000;

export interface UseUnreadResult {
  counts: UnreadCounts;
  refresh: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

// fetchUnread is a thin wrapper around the gateway endpoint, scoped so
// callers can mock it in tests. The default points at the same gateway
// route the comms client uses; we don't import the comms module here to
// avoid pulling next/headers into the client bundle.
async function fetchUnread(): Promise<UnreadCounts> {
  const res = await fetch('/v1/captable/comms/unread', {
    cache: 'no-store',
    credentials: 'same-origin',
  });
  if (!res.ok) {
    throw new Error(`unread fetch failed: ${res.status}`);
  }
  return (await res.json()) as UnreadCounts;
}

export function useUnreadCount(): UseUnreadResult {
  const [counts, setCounts] = useState<UnreadCounts>(EMPTY_COUNTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timer = useRef<number | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await fetchUnread();
      if (mounted.current) {
        setCounts(next);
        setError(null);
      }
    } catch (err) {
      if (mounted.current) setError(err as Error);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  // Schedule + reschedule the next poll. Bails when the tab is hidden so
  // we don't burn polling cycles in the background.
  const schedule = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if (typeof document !== 'undefined' && document.hidden) return;
    timer.current = window.setTimeout(() => {
      refresh().finally(schedule);
    }, POLL_MS);
  }, [refresh]);

  useEffect(() => {
    mounted.current = true;
    refresh().finally(schedule);

    const onVis = () => {
      if (!document.hidden) refresh().finally(schedule);
      else if (timer.current !== null) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      mounted.current = false;
      document.removeEventListener('visibilitychange', onVis);
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [refresh, schedule]);

  return { counts, refresh, loading, error };
}

// Exposed for tests so the fetch path can be swapped without rewiring
// the global fetch.
export const __test = { fetchUnread };
