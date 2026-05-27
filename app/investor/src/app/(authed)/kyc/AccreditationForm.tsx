'use client';

// Accreditation renewal — picks a method (income / net-worth /
// professional / entity / 506(c) third-party), references already-
// uploaded document ids, and optionally asserts qualified-purchaser
// status (3(c)(7), $5M investments threshold).
//
// Document upload itself lives in the Documents surface (G-22b); this
// form only references the ids.

import { useState, useTransition } from 'react';
import { Button, Select } from '@/components/forms';
import { Notice } from '@/components/data';
import {
  gateway,
  type AccreditationMethod,
  type AccreditationRefreshRequest,
  type IdentityProfile,
} from '@/lib/gateway';

const METHODS: { value: AccreditationMethod; label: string; help: string }[] = [
  {
    value: 'income',
    label: 'Income (Reg D 506(b)/(c) self-cert)',
    help: 'Annual income > $200K ($300K joint) for the past two years.',
  },
  {
    value: 'net_worth',
    label: 'Net worth',
    help: 'Net worth > $1M excluding primary residence.',
  },
  {
    value: 'professional',
    label: 'Professional (Series 7 / 65 / 82, knowledgeable employee)',
    help: 'SEC-recognised professional credential or knowledgeable-employee status.',
  },
  {
    value: 'entity',
    label: 'Entity (assets > $5M / family office / etc.)',
    help: 'Entity-level accreditation per Rule 501(a)(3) / (7) / (8) / (9) / (12).',
  },
  {
    value: 'third_party',
    label: '506(c) third-party verification',
    help: 'Letter from registered BD / IA / CPA / attorney (90-day freshness).',
  },
];

const INCOME_BANDS = [
  { value: 'under_200k', label: 'Under $200K' },
  { value: '200k_300k', label: '$200K – $300K' },
  { value: '300k_500k', label: '$300K – $500K' },
  { value: 'over_500k', label: 'Over $500K' },
];

const NETWORTH_BANDS = [
  { value: 'under_1m', label: 'Under $1M' },
  { value: '1m_5m', label: '$1M – $5M' },
  { value: '5m_25m', label: '$5M – $25M' },
  { value: 'over_25m', label: 'Over $25M' },
];

export function AccreditationForm({ profile }: { profile: IdentityProfile }) {
  const [method, setMethod] = useState<AccreditationMethod>(
    profile.accreditation.method ?? 'net_worth',
  );
  const [documentIDs, setDocumentIDs] = useState('');
  const [incomeBand, setIncomeBand] = useState<
    AccreditationRefreshRequest['incomeBand']
  >('200k_300k');
  const [netWorthBand, setNetWorthBand] = useState<
    AccreditationRefreshRequest['netWorthBand']
  >('1m_5m');
  const [qp, setQp] = useState(profile.accreditation.isQualifiedPurchaser);
  const [busy, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function submit() {
    startTransition(async () => {
      setErr(null);
      setOk(null);
      const ids = documentIDs
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const req: AccreditationRefreshRequest = {
        method,
        documentIDs: ids,
        qualifiedPurchaser: qp,
      };
      if (method === 'income') req.incomeBand = incomeBand;
      if (method === 'net_worth') req.netWorthBand = netWorthBand;
      try {
        await gateway.identity.refreshAccreditation(req);
        setOk('Accreditation submitted. NCPS will return the verification within 24 hours.');
      } catch (e) {
        setErr((e as Error).message);
      }
    });
  }

  const help = METHODS.find((m) => m.value === method)?.help ?? '';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-3"
      aria-label="Accreditation renewal"
    >
      <Select
        label="Method"
        name="method"
        value={method}
        options={METHODS.map((m) => ({ value: m.value, label: m.label }))}
        onChange={(e) => setMethod(e.target.value as AccreditationMethod)}
      />
      <p className="text-[1.2rem] text-[var(--color-secondary)]">{help}</p>

      {method === 'income' ? (
        <Select
          label="Income band"
          name="incomeBand"
          value={incomeBand}
          options={INCOME_BANDS}
          onChange={(e) =>
            setIncomeBand(e.target.value as AccreditationRefreshRequest['incomeBand'])
          }
        />
      ) : null}
      {method === 'net_worth' ? (
        <Select
          label="Net-worth band"
          name="netWorthBand"
          value={netWorthBand}
          options={NETWORTH_BANDS}
          onChange={(e) =>
            setNetWorthBand(e.target.value as AccreditationRefreshRequest['netWorthBand'])
          }
        />
      ) : null}

      <label className="flex flex-col gap-1 text-[1.2rem]">
        Supporting document IDs (comma- or whitespace-separated; upload in
        Documents first)
        <input
          value={documentIDs}
          onChange={(e) => setDocumentIDs(e.target.value)}
          placeholder="doc_001 doc_002"
          className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem] font-mono"
        />
      </label>

      <label className="text-[1.3rem] flex items-center gap-2">
        <input
          type="checkbox"
          checked={qp}
          onChange={(e) => setQp(e.target.checked)}
        />
        Also assert qualified-purchaser status (3(c)(7), $5M investments)
      </label>

      <Button type="submit" disabled={busy} className="self-start">
        Submit
      </Button>
      {err ? <Notice tone="error">{err}</Notice> : null}
      {ok ? <Notice tone="success">{ok}</Notice> : null}
    </form>
  );
}
