import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BeneficiaryEditor } from '@/app/(authed)/beneficiary/BeneficiaryEditor';
import { mockBeneficiaries } from '@/lib/gateway/fixtures';
import type { Beneficiary } from '@/lib/gateway';

const setBeneficiariesMock = vi.fn();

vi.mock('@/lib/gateway', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/gateway')>();
  return {
    ...actual,
    gateway: {
      ...actual.gateway,
      identity: {
        ...actual.gateway.identity,
        setBeneficiaries: (...args: unknown[]) =>
          setBeneficiariesMock(...args),
      },
    },
  };
});

describe('BeneficiaryEditor', () => {
  beforeEach(() => {
    setBeneficiariesMock.mockReset();
  });

  it('renders one row per existing beneficiary', () => {
    render(<BeneficiaryEditor initial={mockBeneficiaries()} />);
    expect(screen.getByDisplayValue('John Investor')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1.00')).toBeInTheDocument();
  });

  it('refuses to submit when shares do not sum to 1', () => {
    const partial: Beneficiary[] = [
      {
        ...mockBeneficiaries()[0],
        share: '0.40',
      },
    ];
    render(<BeneficiaryEditor initial={partial} />);
    // Submit button is disabled because shares don't sum to 1.
    const submitBtn = screen.getByRole('button', { name: 'Submit slate' });
    expect(submitBtn).toBeDisabled();
    fireEvent.click(submitBtn);
    expect(setBeneficiariesMock).not.toHaveBeenCalled();
  });

  it('submits a valid slate that sums to 1', async () => {
    setBeneficiariesMock.mockResolvedValueOnce(mockBeneficiaries());
    render(<BeneficiaryEditor initial={mockBeneficiaries()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Submit slate' }));
    await waitFor(() => expect(setBeneficiariesMock).toHaveBeenCalledOnce());
    const arg = setBeneficiariesMock.mock.calls[0][0];
    expect(arg.beneficiaries.length).toBe(1);
    expect(arg.beneficiaries[0].legalName).toBe('John Investor');
    expect(arg.beneficiaries[0].share).toBe('1.00');
  });

  it('appends a new row when "Add beneficiary" is clicked', () => {
    render(<BeneficiaryEditor initial={mockBeneficiaries()} />);
    const before = screen.getAllByRole('row').length;
    fireEvent.click(screen.getByRole('button', { name: 'Add beneficiary' }));
    const after = screen.getAllByRole('row').length;
    expect(after).toBe(before + 1);
  });

  it('renders a pending dual-control row alongside active rows', () => {
    const pending: Beneficiary = {
      ...mockBeneficiaries()[0],
      id: 'bene_pending',
      legalName: 'Pending Heir',
      share: '0.00',
      status: 'pending_dual_control',
      dualControlCaseID: 'case_001',
    };
    render(<BeneficiaryEditor initial={[...mockBeneficiaries(), pending]} />);
    expect(screen.getByDisplayValue('Pending Heir')).toBeInTheDocument();
  });
});
