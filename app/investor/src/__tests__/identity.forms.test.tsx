import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KYCRefreshForm } from '@/app/(authed)/kyc/KYCRefreshForm';
import { AccreditationForm } from '@/app/(authed)/kyc/AccreditationForm';
import { W8RenewalForm } from '@/app/(authed)/kyc/W8RenewalForm';
import { ProfileForm } from '@/app/(authed)/profile/ProfileForm';
import {
  mockIdentityProfile,
  mockIdentityProfileForeign,
} from '@/lib/gateway/fixtures';

const refreshKYCMock = vi.fn();
const refreshAccMock = vi.fn();
const renewW8Mock = vi.fn();
const changeAddressMock = vi.fn();

vi.mock('@/lib/gateway', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/gateway')>();
  return {
    ...actual,
    gateway: {
      ...actual.gateway,
      identity: {
        ...actual.gateway.identity,
        refreshKYC: (...args: unknown[]) => refreshKYCMock(...args),
        refreshAccreditation: (...args: unknown[]) => refreshAccMock(...args),
        renewW8: (...args: unknown[]) => renewW8Mock(...args),
        changeAddress: (...args: unknown[]) => changeAddressMock(...args),
      },
    },
  };
});

describe('KYCRefreshForm — US (W-9 path)', () => {
  beforeEach(() => {
    refreshKYCMock.mockReset();
  });

  it('renders W-9 classification + TIN field for US investors', () => {
    render(<KYCRefreshForm profile={mockIdentityProfile()} isUS />);
    expect(screen.getByLabelText(/W-9 tax classification/)).toBeInTheDocument();
    expect(screen.getByLabelText(/TIN \(SSN \/ EIN\)/)).toBeInTheDocument();
  });

  it('tokenises the TIN client-side and submits to refreshKYC', async () => {
    refreshKYCMock.mockResolvedValueOnce(mockIdentityProfile());
    render(<KYCRefreshForm profile={mockIdentityProfile()} isUS />);
    fireEvent.change(screen.getByLabelText(/Date of birth/), {
      target: { value: '1980-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/TIN \(SSN \/ EIN\)/), {
      target: { value: '123456789' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Submit refresh/ }));
    await waitFor(() => expect(refreshKYCMock).toHaveBeenCalledOnce());
    const arg = refreshKYCMock.mock.calls[0][0];
    expect(arg.taxForm).toBe('w9');
    expect(arg.w9?.tinTokenized).toMatch(/^tin_[0-9a-f]{32}$/);
    expect(arg.w9?.tinTokenized).not.toContain('123456789');
  });
});

describe('KYCRefreshForm — non-US (W-8 path)', () => {
  beforeEach(() => {
    refreshKYCMock.mockReset();
  });

  it('renders W-8 form-type picker for non-US investors', () => {
    render(
      <KYCRefreshForm profile={mockIdentityProfileForeign()} isUS={false} />,
    );
    expect(screen.getByLabelText(/W-8 form type/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/TIN \(SSN \/ EIN\)/)).not.toBeInTheDocument();
  });

  it('submits with the chosen W-8 form-type + treaty details', async () => {
    refreshKYCMock.mockResolvedValueOnce(mockIdentityProfileForeign());
    render(
      <KYCRefreshForm profile={mockIdentityProfileForeign()} isUS={false} />,
    );
    fireEvent.change(screen.getByLabelText(/Date of birth/), {
      target: { value: '1975-05-10' },
    });
    fireEvent.change(screen.getByLabelText(/Foreign TIN/), {
      target: { value: 'JP-TIN-9999' },
    });
    fireEvent.change(screen.getByLabelText(/Treaty article/), {
      target: { value: '11(2)' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Submit refresh/ }));
    await waitFor(() => expect(refreshKYCMock).toHaveBeenCalledOnce());
    const arg = refreshKYCMock.mock.calls[0][0];
    expect(arg.taxForm).toBe('w8ben');
    expect(arg.w8?.formType).toBe('w8ben');
    expect(arg.w8?.treatyCountry).toBe('JP');
    expect(arg.w8?.foreignTIN).toBe('JP-TIN-9999');
  });
});

describe('AccreditationForm', () => {
  beforeEach(() => {
    refreshAccMock.mockReset();
  });

  it('submits the chosen method with banded inputs', async () => {
    refreshAccMock.mockResolvedValueOnce(mockIdentityProfile());
    render(<AccreditationForm profile={mockIdentityProfile()} />);
    // Default method is net_worth (matches mock); change to income
    fireEvent.change(screen.getByLabelText('Method'), {
      target: { value: 'income' },
    });
    fireEvent.change(screen.getByLabelText('Income band'), {
      target: { value: '300k_500k' },
    });
    fireEvent.change(screen.getByLabelText(/Supporting document IDs/), {
      target: { value: 'doc_a doc_b doc_c' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(refreshAccMock).toHaveBeenCalledOnce());
    const arg = refreshAccMock.mock.calls[0][0];
    expect(arg.method).toBe('income');
    expect(arg.incomeBand).toBe('300k_500k');
    expect(arg.documentIDs).toEqual(['doc_a', 'doc_b', 'doc_c']);
  });
});

describe('W8RenewalForm', () => {
  beforeEach(() => {
    renewW8Mock.mockReset();
  });

  it('refuses to submit without the beneficial-owner attestation', () => {
    render(<W8RenewalForm profile={mockIdentityProfileForeign()} />);
    fireEvent.change(screen.getByLabelText(/Foreign TIN/), {
      target: { value: 'JP-TIN-1111' },
    });
    fireEvent.change(screen.getByLabelText(/Treaty article/), {
      target: { value: '11(2)' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Submit W-8 renewal/ }));
    expect(screen.getByText(/must attest beneficial-owner status/)).toBeInTheDocument();
    expect(renewW8Mock).not.toHaveBeenCalled();
  });

  it('submits a renewal once the attestation is checked', async () => {
    renewW8Mock.mockResolvedValueOnce(mockIdentityProfileForeign());
    render(<W8RenewalForm profile={mockIdentityProfileForeign()} />);
    fireEvent.change(screen.getByLabelText(/Foreign TIN/), {
      target: { value: 'JP-TIN-2222' },
    });
    fireEvent.change(screen.getByLabelText(/Treaty article/), {
      target: { value: '11(2)' },
    });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /Submit W-8 renewal/ }));
    await waitFor(() => expect(renewW8Mock).toHaveBeenCalledOnce());
    const arg = renewW8Mock.mock.calls[0][0];
    expect(arg.attestation).toBe(true);
  });
});

describe('ProfileForm (address change)', () => {
  beforeEach(() => {
    changeAddressMock.mockReset();
  });

  it('submits the new address with reason + effective date', async () => {
    changeAddressMock.mockResolvedValueOnce(mockIdentityProfile());
    render(<ProfileForm profile={mockIdentityProfile()} />);
    fireEvent.change(screen.getByLabelText('Line 1'), {
      target: { value: '999 New Address Ave' },
    });
    fireEvent.change(screen.getByLabelText('Reason'), {
      target: { value: 'correction' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Submit address change/ }));
    await waitFor(() => expect(changeAddressMock).toHaveBeenCalledOnce());
    const arg = changeAddressMock.mock.calls[0][0];
    expect(arg.address.line1).toBe('999 New Address Ave');
    expect(arg.reason).toBe('correction');
    expect(arg.effectiveAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
