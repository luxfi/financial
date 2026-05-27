# @luxbank/investor — Lux Investor Portal

Investor-facing portal for `investor.lux.financial`. Next.js 15 + React 19 +
Tailwind 4, TypeScript strict mode, deployed to Cloudflare Pages.

Counterpart to the operator console at `app.lux.financial` (`@luxbank/console`)
and the marketing site at `lux.financial` (`@luxbank/site`). Reads from the
four backend services (`luxfi/captable`, `luxfi/transfer`, `luxfi/treasury`,
`luxfi/broker`) through the operator gateway — never directly.

## What's in here

This portal implements the §10 substages of the Lux RWA / Digital Securities
gap analysis (gap **G-22**). Substage ownership is split across three parallel
build agents:

| Stage | Surface | Owner |
|-------|---------|-------|
| 10.1  | Account dashboard (positions, NAV, cost basis, unrealized P&L, pending settlement) | A (foundation) |
| 10.2  | Document vault | B |
| 10.3  | Communications inbox | B |
| 10.4  | Wallet / payment methods | C |
| 10.5  | Secondary market | C |
| 10.6  | Tax documents (1099 / K-1 / 1042-S / cost basis) | B |
| 10.7  | KYC refresh + W-8 renewal | C |
| 10.8  | Beneficial-owner / address change | C |
| 10.9  | Beneficiary / TOD designation | C |
| 10.10 | Audit log (investor-initiated actions) | A (this) |

The foundation — auth middleware, gateway clients, shell, sign-in flow — is
owned by agent A and used by all substages.

## Architecture

```
investor.lux.financial  (this app)
        │
        │   1. browser holds an HTTP-only session cookie containing the
        │      JWT issued by Hanzo IAM (iam.luxfi.io)
        │
        │   2. src/middleware.ts verifies the JWT (jose + JWKS) and injects
        │      X-Lux-Sub / X-Lux-Investor-Id / X-Lux-Tenant-Id headers
        │
        │   3. server components call src/lib/gateway/* which proxies through
        │      the operator gateway at NEXT_PUBLIC_GATEWAY_URL
        │
        ▼
api.lux.financial  (operator gateway)
        │
        │   enforces tenant + investor scope; signs requests forward
        │
        ▼
    ┌───────────┬───────────┬────────────┬──────────┐
    │ captable  │ transfer  │  treasury  │  broker  │
    └───────────┴───────────┴────────────┴──────────┘
```

The browser **never** sees a backend URL. Every gateway client function in
`src/lib/gateway/*` builds a request to the gateway and the gateway routes
by URL prefix (`/v1/captable/…`, `/v1/transfer/…`, …) with the identity
headers preserved.

## Routes

| Path | What |
|------|------|
| `/` | Redirect to `/dashboard`. |
| `/dashboard` | Positions, NAV, cost basis, unrealized P&L, pending settlements. |
| `/activity` | Audit-log timeline of investor-initiated actions with CSV export. |
| `/signin` | OIDC + magic-link sign-in. |
| `/signout` | Clears the session cookie and bounces to IAM logout. |
| `/api/auth/callback` | OIDC code-exchange handler. |
| `/api/auth/magic-link` | Magic-link request handler. |
| `/api/audit/export.csv` | Proxies the gateway CSV export endpoint. |

Agent B / C own the routes for §10.2–§10.9; they live alongside this in
`src/app/(authed)/{documents,inbox,tax,wallet,market,kyc,profile,beneficiary}`.

## Run

```sh
pnpm -F @luxbank/investor dev
# → http://localhost:3002
```

Static export for Cloudflare Pages:

```sh
pnpm -F @luxbank/investor export
pnpm -F @luxbank/investor deploy:cf
```

## Tests

```sh
pnpm -F @luxbank/investor test
```

Vitest + Testing Library + happy-dom. Covers:

- `auth/session` — header-based session extraction and validation.
- `auth/sign-in-url` — OIDC authorize / sign-out URL construction.
- `gateway/transport` — URL routing, identity-header injection, JSON
  body handling, error mapping (`GatewayError`).
- `gateway/audit` — CSV row serialization with escape rules.
- `format` — currency / percent / number / date formatters.
- `dashboard` — render of summary card, positions table, settlements card.
- `activity` — render of audit timeline.
- `middleware` — matcher configuration.

## Environment variables

| Key | Default | Used by |
|-----|---------|---------|
| `NEXT_PUBLIC_GATEWAY_URL` | `https://api.lux.financial` | Browser + server fetch base. |
| `NEXT_PUBLIC_IAM_URL` | `https://iam.luxfi.io` | OIDC authorize / logout URLs. |
| `NEXT_PUBLIC_IAM_CLIENT_ID` | `lux-investor-portal` | OIDC client. |
| `IAM_AUDIENCE` | `lux-investor-portal` | JWT audience claim check. |
| `IAM_JWKS_URL` | `https://iam.luxfi.io/.well-known/jwks.json` | JWT signature verification. |
| `IAM_ISSUER` | `https://iam.luxfi.io` | JWT issuer claim check. |
| `NEXT_PUBLIC_SESSION_COOKIE` | `lux_investor_session` | Session cookie name. |
| `NEXT_PUBLIC_PORTAL_URL` | `https://investor.lux.financial` | Used by sign-out for absolute redirect. |
| `LUX_BRAND_INLINE` | *(unset)* | Optional JSON brand override for white-label deploys. |

Secrets (anything not `NEXT_PUBLIC_*`) flow from KMS into the runtime via
the standard deploy pipeline. Nothing is committed to git.

## Auth contract — for other agents working in this app

The middleware sets these headers on every `(authed)` request; any new page,
server component, or API route can read them via `next/headers`:

| Header | Meaning |
|--------|---------|
| `X-Lux-Sub` | Stable IAM subject ID. |
| `X-Lux-Investor-Id` | Investor record ID; the gateway scopes data to this. |
| `X-Lux-Tenant-Id` | Issuer tenant ID. |
| `X-Lux-Email` | Display email. |
| `X-Lux-Name` | Display name. |
| `X-Lux-Exp` | Token expiry (unix seconds). |

Helpers:

```ts
import { headers } from 'next/headers';
import { readSessionFromHeaders } from '@/lib/auth';

const session = readSessionFromHeaders(await headers());
```

## Gateway-client contract

```ts
import { gateway } from '@/lib/gateway';

const summary    = await gateway.captable.portfolioSummary('fifo');
const positions  = await gateway.captable.listPositions('fifo');
const pending    = await gateway.transfer.listPendingSettlements();
const balances   = await gateway.treasury.balances();
const orders     = await gateway.broker.listOpenOrders();
const audit      = await gateway.audit.list({ category: 'trade' });
```

Each method returns a typed Promise. Errors throw `GatewayError` with
`{service, status, body, message}` for diagnostic logging. No silent
failures, no soft-typed `any`.

Adding a new sub-client (e.g. `wallet`, `market`):

1. Create `src/lib/gateway/<name>.ts` with `export const <name> = { … }`.
2. Add the import + entry to `src/lib/gateway/index.ts`.
3. Re-use `callGateway()` from `transport.ts`. Never call `fetch` directly.

## Provenance

This module is built under the Clean-Room Engineering Protocol — see
`legal/INDEPENDENT-IMPLEMENTATION-CLEAN-ROOM-PROTOCOL.md`. Each commit
carries the provenance trailer required by §4 of that protocol.
