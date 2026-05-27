// Backend gateway URLs. The browser only ever talks to the operator gateway;
// the gateway in turn proxies to the four backend services with the investor-
// scoped token injected. Each backend remains hidden from the browser.
//
// In static-export deploys (Cloudflare Pages), only NEXT_PUBLIC_* env vars are
// inlined; the IAM_AUDIENCE / IAM_JWKS_URL are read at runtime on the Node
// server when running `next start` and at edge-function build for middleware.

export const env = {
  // Gateway base URL (proxy to captable / transfer / treasury / broker).
  gatewayUrl:
    process.env.NEXT_PUBLIC_GATEWAY_URL ??
    'https://api.lux.financial',

  // Hanzo IAM (OIDC).
  iamUrl: process.env.NEXT_PUBLIC_IAM_URL ?? 'https://iam.luxfi.io',
  iamClientId:
    process.env.NEXT_PUBLIC_IAM_CLIENT_ID ?? 'lux-investor-portal',
  iamAudience: process.env.IAM_AUDIENCE ?? 'lux-investor-portal',
  iamJwksUrl:
    process.env.IAM_JWKS_URL ?? 'https://iam.luxfi.io/.well-known/jwks.json',
  iamIssuer: process.env.IAM_ISSUER ?? 'https://iam.luxfi.io',

  // Cookie name for the session token. Lives only on this domain.
  sessionCookie:
    process.env.NEXT_PUBLIC_SESSION_COOKIE ?? 'lux_investor_session',
} as const;

export type Env = typeof env;
