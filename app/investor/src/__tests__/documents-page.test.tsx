// Documents page — server render with mocked WORM-sourced documents.
//
// We mock the gateway client so the server component returns deterministic
// rows; the page renders through React Testing Library.

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/gateway/document', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/gateway/document')>(
      '@/lib/gateway/document',
    );
  const SAMPLE = [
    {
      id: 'doc_subagreement_1',
      name: 'Acme Series A Subscription Agreement.pdf',
      docType: 'subscription_agreement',
      category: 'subscription_agreement' as const,
      issuedBy: 'Acme Corp',
      issuedDate: '2024-03-15T00:00:00Z',
      sizeBytes: 184_320,
      mimeType: 'application/pdf',
      sha256:
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      retainUntil: '2031-03-15T00:00:00Z',
      offeringID: 'off_acme_a',
      offeringName: 'Acme Series A',
    },
    {
      id: 'doc_k1_2024',
      name: '2024 Schedule K-1.pdf',
      docType: 'k1',
      category: 'k1' as const,
      issuedBy: 'Acme Fund LP',
      issuedDate: '2025-03-12T00:00:00Z',
      sizeBytes: 38_400,
      mimeType: 'application/pdf',
      sha256:
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      retainUntil: '2032-03-12T00:00:00Z',
    },
  ];
  return {
    ...actual,
    document: {
      list: vi.fn().mockResolvedValue(SAMPLE),
      get: vi.fn(),
      share: vi.fn(),
    },
  };
});

import DocumentsPage from '@/app/(authed)/documents/page';

describe('DocumentsPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the document vault with the WORM rows', async () => {
    const page = await DocumentsPage();
    render(page as React.ReactElement);

    expect(
      screen.getByRole('heading', { name: 'Documents' }),
    ).toBeInTheDocument();

    // Tree view of categories renders.
    const tree = screen.getByTestId('document-categories');
    expect(tree).toBeInTheDocument();
    expect(tree.textContent).toMatch(/All documents/);
    expect(tree.textContent).toMatch(/Subscription agreements/);
    expect(tree.textContent).toMatch(/Schedule K-1/);
    expect(tree.textContent).toMatch(/1099 forms/);
    expect(tree.textContent).toMatch(/Annual reports/);
    expect(tree.textContent).toMatch(/Side letters/);
    expect(tree.textContent).toMatch(/Offering memoranda/);
    expect(tree.textContent).toMatch(/Custody statements/);

    // Doc rows render with name + issuer + size.
    expect(
      screen.getByText('Acme Series A Subscription Agreement.pdf'),
    ).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('2024 Schedule K-1.pdf')).toBeInTheDocument();
    expect(screen.getByText('Acme Fund LP')).toBeInTheDocument();

    // Actions are present.
    expect(screen.getAllByRole('button', { name: 'View' }).length).toBe(2);
    expect(screen.getAllByRole('button', { name: 'Download' }).length).toBe(
      2,
    );
    expect(
      screen.getAllByRole('button', { name: 'Share with advisor' }).length,
    ).toBe(2);
  });
});
