// Stage 10.6 — Tax-doc download + cost-basis report.
//
// Server component. Lists the tax years the investor has at least one
// form in (1099 family + Schedule K-1) and renders the per-year folder
// view + cost-basis calculator in TaxView.
//
// Source-of-design: Lux-Prior-IP
// Source-ref: ../../lib/gateway/tax.ts (mirrors captable/pkg/tax incl.
//   iris + fire e-file adapters).

import { tax } from '@/lib/gateway/tax';
import { PageHeader, Notice } from '@/components/data';
import { TaxView } from './TaxView';

export const dynamic = 'force-dynamic';

export default async function TaxPage() {
  let years: number[] = [];
  let error: string | null = null;
  try {
    years = await tax.listYears();
  } catch (err) {
    error = (err as Error).message;
  }

  // Pre-load the most-recent year so the page lands populated.
  const initialYear = years[0] ?? new Date().getUTCFullYear() - 1;

  return (
    <>
      <PageHeader
        title="Tax Documents"
        subtitle="1099 forms (DIV / B / INT / MISC / NEC / OID / K / R), Schedule K-1, and per-lot cost-basis (FIFO / LIFO / specific) with 8949-ready CSV export. 1099 e-file routes through IRIS + FIRE."
      />
      {error ? (
        <Notice tone="error">Failed to load tax index: {error}</Notice>
      ) : null}
      <TaxView years={years} initialYear={initialYear} />
    </>
  );
}
