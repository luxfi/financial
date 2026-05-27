import { env } from '../env';

// buildAuthorizeUrl returns the OIDC authorize URL to redirect into IAM.
// returnTo is the absolute URL the IAM callback should land on after exchange.
export function buildAuthorizeUrl(returnTo: string): string {
  const u = new URL('/oauth/authorize', env.iamUrl);
  u.searchParams.set('client_id', env.iamClientId);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set(
    'scope',
    'openid profile email investor:positions investor:documents investor:trades investor:audit',
  );
  u.searchParams.set('redirect_uri', returnTo);
  return u.toString();
}

// buildSignOutUrl ends the IAM session and lands back at returnTo.
export function buildSignOutUrl(returnTo: string): string {
  const u = new URL('/oauth/logout', env.iamUrl);
  u.searchParams.set('client_id', env.iamClientId);
  u.searchParams.set('post_logout_redirect_uri', returnTo);
  return u.toString();
}
