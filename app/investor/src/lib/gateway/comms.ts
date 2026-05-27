// comms client — investor inbox. Surfaces every Notice from luxfi/captable
// comms scoped to the authenticated investor, plus an unread counter the
// shared shell uses for its badge.
//
// Notice types (per G-22 Stage 10.3 + captable/comms Notice.Type):
//
//   regulatory   — venue / TA / regulator notifications
//   dividend     — declared dividend announcements
//   proxy        — proxy / annual-meeting solicitations
//   corp_action  — splits, mergers, conversions, recaps
//   distribution — fund / LP distribution announcements
//   kyc_refresh  — KYC / accredited-status renewal prompts
//   general      — everything else

import { callGateway } from './transport';
import type { ISODate } from './types';

export type NoticeType =
  | 'regulatory'
  | 'dividend'
  | 'proxy'
  | 'corp_action'
  | 'distribution'
  | 'kyc_refresh'
  | 'general';

export interface NoticeRow {
  id: string;
  type: NoticeType;
  subject: string;
  issuedBy: string;
  issuedAt: ISODate;
  readAt: ISODate | null;
  // True iff the body carries a callable action (proxy vote, KYC
  // refresh, ack-required regulatory disclosure).
  actionRequired: boolean;
}

export interface NoticeDetail extends NoticeRow {
  bodyHtml: string;
  // Optional structured action — present iff actionRequired.
  action?: NoticeAction;
}

export type NoticeAction =
  | {
      kind: 'proxy_vote';
      meetingID: string;
      meetingDate: ISODate;
      voteDeadline: ISODate;
      // Hand off to /voting (owned by Agent C if exposed; otherwise this
      // resolves to the operator-side proxy UI).
      voteUrl: string;
    }
  | {
      kind: 'kyc_refresh';
      // Hand off to the KYC refresh flow Agent C owns.
      refreshUrl: string;
      dueBy: ISODate;
    }
  | {
      kind: 'acknowledge';
      // Simple read-and-ack regulatory disclosure.
      ackEndpoint: string;
    };

export interface UnreadCounts {
  total: number;
  byType: Record<NoticeType, number>;
  // The most-recent notice timestamp seen; the shell uses it for the
  // "new since" tooltip.
  latestAt: ISODate | null;
}

export const comms = {
  // list returns the notice index for the authenticated investor.
  async list(opts?: {
    type?: NoticeType;
    unreadOnly?: boolean;
    limit?: number;
  }): Promise<NoticeRow[]> {
    return callGateway<NoticeRow[]>({
      service: 'captable',
      path: '/comms/notices',
      query: {
        type: opts?.type,
        unread: opts?.unreadOnly ? 'true' : undefined,
        limit: opts?.limit ?? 100,
      },
    });
  },

  // get returns full notice detail (HTML body + structured action).
  async get(noticeID: string): Promise<NoticeDetail> {
    return callGateway<NoticeDetail>({
      service: 'captable',
      path: `/comms/notices/${encodeURIComponent(noticeID)}`,
    });
  },

  // markRead acknowledges the notice. Idempotent. Returns the new
  // unread counts so the shell badge can refresh without a second
  // round trip.
  async markRead(noticeID: string): Promise<UnreadCounts> {
    return callGateway<UnreadCounts>({
      service: 'captable',
      method: 'POST',
      path: `/comms/notices/${encodeURIComponent(noticeID)}/read`,
    });
  },

  // acknowledge fires a read-and-ack regulatory disclosure. Same as
  // markRead but also records an attestation event on the audit trail.
  async acknowledge(noticeID: string): Promise<UnreadCounts> {
    return callGateway<UnreadCounts>({
      service: 'captable',
      method: 'POST',
      path: `/comms/notices/${encodeURIComponent(noticeID)}/acknowledge`,
    });
  },

  // unread returns the aggregate counts powering the shell badge.
  async unread(): Promise<UnreadCounts> {
    return callGateway<UnreadCounts>({
      service: 'captable',
      path: '/comms/unread',
    });
  },
};

export const NOTICE_TYPE_LABEL: Record<NoticeType, string> = {
  regulatory: 'Regulatory',
  dividend: 'Dividend',
  proxy: 'Proxy',
  corp_action: 'Corporate action',
  distribution: 'Distribution',
  kyc_refresh: 'KYC refresh',
  general: 'General',
};
