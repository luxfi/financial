// Backend API URLs — all brand-neutral env knobs.
// Each backend is a separate domain; the console aggregates them via typed hooks.
export const env = {
  iamUrl: process.env.NEXT_PUBLIC_IAM_URL ?? "https://iam.lux.financial",
  iamClientId: process.env.NEXT_PUBLIC_IAM_CLIENT_ID ?? "lux-console",
  bankApiUrl: process.env.NEXT_PUBLIC_BANK_API_URL ?? "",
  forexApiUrl: process.env.NEXT_PUBLIC_FOREX_API_URL ?? "",
  brokerApiUrl: process.env.NEXT_PUBLIC_BROKER_API_URL ?? "",
  treasuryApiUrl: process.env.NEXT_PUBLIC_TREASURY_API_URL ?? "",
  bridgeApiUrl: process.env.NEXT_PUBLIC_BRIDGE_API_URL ?? "",
} as const;
