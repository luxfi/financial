import { describe, it, expect } from 'vitest';
import { buildAuthorizeUrl, buildSignOutUrl } from '@/lib/auth/sign-in-url';

describe('buildAuthorizeUrl', () => {
  it('points at the configured IAM with the expected parameters', () => {
    const url = new URL(buildAuthorizeUrl('https://x.invalid/callback'));
    expect(url.host).toContain('iam');
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('redirect_uri')).toBe('https://x.invalid/callback');
    expect(url.searchParams.get('scope')).toContain('openid');
    expect(url.searchParams.get('scope')).toContain('investor:positions');
    expect(url.searchParams.get('scope')).toContain('investor:audit');
    expect(url.searchParams.get('client_id')).toBeTruthy();
  });
});

describe('buildSignOutUrl', () => {
  it('includes post_logout_redirect_uri', () => {
    const url = new URL(buildSignOutUrl('https://example.test/signin'));
    expect(url.searchParams.get('post_logout_redirect_uri')).toBe(
      'https://example.test/signin',
    );
    expect(url.searchParams.get('client_id')).toBeTruthy();
  });
});
