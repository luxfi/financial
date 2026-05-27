// Stage 10.2 — Document Vault.
//
// Server component. Pulls the investor's full document index from the
// gateway (which fronts a luxfi/transfer worm.Store), surfaces each row
// with download / view / share controls. The actual body fetch + SHA-256
// verification happens in the client-side row component so the
// integrity check runs in the user's browser, not the server.
//
// Source-of-design: Lux-Prior-IP
// Source-ref: ../../lib/gateway/document.ts (mirrors captable/pkg/document)
//   plus transfer/pkg/worm Store contract for the integrity flow.

import { document, DOCUMENT_CATEGORIES, type DocumentRow } from '@/lib/gateway/document';
import { PageHeader, Notice } from '@/components/data';
import { DocumentVault } from './DocumentVault';

export const dynamic = 'force-dynamic';

export default async function DocumentsPage() {
  let rows: DocumentRow[] = [];
  let error: string | null = null;
  try {
    rows = await document.list();
  } catch (err) {
    error = (err as Error).message;
  }

  return (
    <>
      <PageHeader
        title="Documents"
        subtitle="Subscription agreements, K-1s, 1099s, annual reports, side letters, offering memoranda, custody statements. Every record is sealed under WORM (SEC 17a-4(f)(2) / FINRA 4511); SHA-256 integrity is re-verified in your browser on every read."
      />
      {error ? <Notice tone="error">Failed to load documents: {error}</Notice> : null}
      <DocumentVault initialRows={rows} categories={DOCUMENT_CATEGORIES} />
    </>
  );
}
