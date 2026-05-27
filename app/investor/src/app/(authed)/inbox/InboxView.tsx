'use client';

// InboxView — left-side list filtered by type + read state, right-side
// detail panel with body + action button. Acknowledgements + reads are
// optimistic; the shared useUnreadCount hook refreshes itself on a
// polling interval so the badge corrects within 60 s if anything drifts.

import { useEffect, useMemo, useState } from 'react';
import { Card, Notice as NoticeBlock, DataTable, type Column } from '@/components/data';
import { Button, Select } from '@/components/forms';
import {
  comms,
  NOTICE_TYPE_LABEL,
  type NoticeAction,
  type NoticeDetail,
  type NoticeRow,
  type NoticeType,
  type UnreadCounts,
} from '@/lib/gateway/comms';
import { fmtDateTime } from '@/lib/format';

export interface InboxViewProps {
  initialRows: NoticeRow[];
  initialUnread: UnreadCounts;
}

type Filter = {
  type: NoticeType | 'all';
  unreadOnly: boolean;
};

export function InboxView({ initialRows, initialUnread }: InboxViewProps) {
  const [rows, setRows] = useState(initialRows);
  const [unread, setUnread] = useState(initialUnread);
  const [filter, setFilter] = useState<Filter>({ type: 'all', unreadOnly: false });
  const [selectedID, setSelectedID] = useState<string | null>(
    initialRows[0]?.id ?? null,
  );
  const [detail, setDetail] = useState<NoticeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(
    () => applyFilter(rows, filter),
    [rows, filter],
  );

  // Whenever the selected ID changes, fetch the body and mark-read.
  useEffect(() => {
    if (!selectedID) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setError(null);
    (async () => {
      try {
        const d = await comms.get(selectedID);
        if (cancelled) return;
        setDetail(d);
        // Optimistic mark-read.
        if (!d.readAt) {
          const nextRows = rows.map((r) =>
            r.id === d.id ? { ...r, readAt: new Date().toISOString() } : r,
          );
          setRows(nextRows);
          comms
            .markRead(d.id)
            .then((u) => !cancelled && setUnread(u))
            .catch(() => {/* counter refresh on next poll */});
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedID]);

  async function onAcknowledge() {
    if (!detail) return;
    setBusy(true);
    setError(null);
    try {
      const u = await comms.acknowledge(detail.id);
      setUnread(u);
      setRows((rs) =>
        rs.map((r) =>
          r.id === detail.id ? { ...r, readAt: new Date().toISOString() } : r,
        ),
      );
      // Re-fetch detail to pick up server-side ack state.
      const d = await comms.get(detail.id);
      setDetail(d);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: '420px 1fr' }}>
      <div className="space-y-3">
        <Card>
          <div className="flex gap-3 items-center">
            <Select
              name="notice-type"
              label="Type"
              value={filter.type}
              onChange={(e) =>
                setFilter((f) => ({
                  ...f,
                  type: e.target.value as NoticeType | 'all',
                }))
              }
              options={[
                { value: 'all', label: `All (${rows.length})` },
                ...(Object.keys(NOTICE_TYPE_LABEL) as NoticeType[]).map(
                  (t) => ({
                    value: t,
                    label: `${NOTICE_TYPE_LABEL[t]} (${unread.byType[t] ?? 0})`,
                  }),
                ),
              ]}
            />
            <label className="text-[1.3rem] flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={filter.unreadOnly}
                onChange={(e) =>
                  setFilter((f) => ({ ...f, unreadOnly: e.target.checked }))
                }
              />
              Unread only ({unread.total})
            </label>
          </div>
        </Card>
        <Card>
          <DataTable<NoticeRow>
            ariaLabel="Inbox notices"
            rowKey={(r) => r.id}
            empty="No notices."
            rows={filtered}
            columns={INBOX_COLUMNS(selectedID, setSelectedID)}
          />
        </Card>
      </div>

      <div className="space-y-3">
        {error ? <NoticeBlock tone="error">{error}</NoticeBlock> : null}
        {detail ? (
          <NoticeDetailCard
            detail={detail}
            onAcknowledge={onAcknowledge}
            busy={busy}
          />
        ) : (
          <Card>
            <p className="text-[var(--color-muted)] text-[1.3rem]">
              Select a notice on the left to view the full body.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function INBOX_COLUMNS(
  selectedID: string | null,
  onSelect: (id: string) => void,
): Column<NoticeRow>[] {
  return [
    {
      key: 'subject',
      header: 'Subject',
      render: (r) => (
        <button
          type="button"
          onClick={() => onSelect(r.id)}
          className={[
            'w-full text-left',
            selectedID === r.id ? 'text-[var(--color-accent)]' : '',
          ].join(' ')}
        >
          <div
            className={[
              'font-medium',
              !r.readAt ? 'text-[var(--color-foreground)]' : 'text-[var(--color-secondary)]',
            ].join(' ')}
          >
            {r.subject}
          </div>
          <div className="text-[1.1rem] text-[var(--color-muted)]">
            {NOTICE_TYPE_LABEL[r.type]} · {r.issuedBy} · {fmtDateTime(r.issuedAt)}
            {!r.readAt ? ' · unread' : ''}
            {r.actionRequired ? ' · action required' : ''}
          </div>
        </button>
      ),
    },
  ];
}

function NoticeDetailCard({
  detail,
  onAcknowledge,
  busy,
}: {
  detail: NoticeDetail;
  onAcknowledge: () => void;
  busy: boolean;
}) {
  return (
    <Card
      title={detail.subject}
      subtitle={`${NOTICE_TYPE_LABEL[detail.type]} · ${detail.issuedBy} · ${fmtDateTime(detail.issuedAt)}`}
    >
      <article
        className="prose-invert text-[1.35rem] leading-7 space-y-3"
        // Body is sanitized server-side before this point.
        dangerouslySetInnerHTML={{ __html: detail.bodyHtml }}
        data-testid="notice-body"
      />
      {detail.action ? (
        <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex justify-end gap-2">
          <ActionButton action={detail.action} onAcknowledge={onAcknowledge} busy={busy} />
        </div>
      ) : null}
    </Card>
  );
}

function ActionButton({
  action,
  onAcknowledge,
  busy,
}: {
  action: NoticeAction;
  onAcknowledge: () => void;
  busy: boolean;
}) {
  switch (action.kind) {
    case 'proxy_vote':
      return (
        <a href={action.voteUrl} target="_self">
          <Button variant="primary">
            Vote · meeting {new Date(action.meetingDate).toLocaleDateString()}
          </Button>
        </a>
      );
    case 'kyc_refresh':
      return (
        <a href={action.refreshUrl} target="_self">
          <Button variant="primary">
            Refresh KYC · due {new Date(action.dueBy).toLocaleDateString()}
          </Button>
        </a>
      );
    case 'acknowledge':
      return (
        <Button variant="primary" onClick={onAcknowledge} disabled={busy}>
          {busy ? 'Acknowledging…' : 'Acknowledge'}
        </Button>
      );
  }
}

function applyFilter(rows: NoticeRow[], f: Filter): NoticeRow[] {
  return rows.filter((r) => {
    if (f.type !== 'all' && r.type !== f.type) return false;
    if (f.unreadOnly && r.readAt) return false;
    return true;
  });
}
