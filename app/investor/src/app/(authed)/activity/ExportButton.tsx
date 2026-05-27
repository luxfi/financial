'use client';

import { useState } from 'react';
import { Button } from '@/components/forms';

// ExportButton drives the CSV download. It calls the same-origin API route
// `/api/audit/export.csv` which server-side proxies to the gateway with the
// caller's identity and streams the CSV body back.
export function ExportButton({
  category,
  outcome,
  since,
  until,
}: {
  category: string;
  outcome: string;
  since: string;
  until: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="ghost"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const q = new URLSearchParams();
          if (category) q.set('category', category);
          if (outcome) q.set('outcome', outcome);
          if (since) q.set('since', since);
          if (until) q.set('until', until);
          const res = await fetch(`/api/audit/export.csv?${q.toString()}`, {
            credentials: 'include',
          });
          if (!res.ok) throw new Error(`export failed: ${res.status}`);
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `lux-investor-activity-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? 'Exporting…' : 'Export CSV'}
    </Button>
  );
}
