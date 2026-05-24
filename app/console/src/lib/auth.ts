import { env } from "./env";

export function buildAuthorizeUrl(returnTo: string): string {
  const u = new URL("/oauth/authorize", env.iamUrl);
  u.searchParams.set("client_id", env.iamClientId);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", "openid profile email accounts cards crypto fx");
  u.searchParams.set("redirect_uri", returnTo);
  return u.toString();
}

export function redirectToSignIn(returnTo: string): void {
  if (typeof window === "undefined") return;
  window.location.assign(buildAuthorizeUrl(returnTo));
}
