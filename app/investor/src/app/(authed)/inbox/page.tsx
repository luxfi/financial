// Stage 10.3 — Communications Inbox.
//
// Server component. Loads the notice index for the authenticated investor
// from the gateway (which surfaces luxfi/captable comms.Notice records).
// The detail view + ack flow lives in InboxView (client component) so
// the shell's unread badge updates optimistically.
//
// Source-of-design: Lux-Prior-IP
// Source-ref: ../../lib/gateway/comms.ts (mirrors captable/pkg/comms)

import { comms, type NoticeRow, type UnreadCounts } from '@/lib/gateway/comms';
import { PageHeader, Notice as NoticeBlock } from '@/components/data';
import { InboxView } from './InboxView';

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
  let rows: NoticeRow[] = [];
  let unread: UnreadCounts = {
    total: 0,
    byType: {
      regulatory: 0,
      dividend: 0,
      proxy: 0,
      corp_action: 0,
      distribution: 0,
      kyc_refresh: 0,
      general: 0,
    },
    latestAt: null,
  };
  let error: string | null = null;
  try {
    [rows, unread] = await Promise.all([comms.list(), comms.unread()]);
  } catch (err) {
    error = (err as Error).message;
  }

  return (
    <>
      <PageHeader
        title="Inbox"
        subtitle="Regulatory notices, dividend declarations, proxy notifications, corporate-action notifications, distribution notifications, and KYC-refresh prompts. Every notice carries a delivery receipt and acknowledgement audit trail."
      />
      {error ? (
        <NoticeBlock tone="error">Failed to load inbox: {error}</NoticeBlock>
      ) : null}
      <InboxView initialRows={rows} initialUnread={unread} />
    </>
  );
}
