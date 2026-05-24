/**
 * Lux Financial Brand Configuration
 *
 * Central brand identity configuration used throughout the platform.
 */

import type {
  BrandConfig,
  BrandColors,
  BrandTypography,
  BrandAssets,
  BrandSocial,
  BrandUrls,
  BrandContactEmails,
  BrandCopyright,
} from './types';
import { getJurisdiction, DEFAULT_JURISDICTION } from './jurisdictions';

/**
 * Lux Financial brand colors
 * Based on the Lux brand guidelines
 */
export const LUX_COLORS: BrandColors = {
  // Primary - Lux purple/violet
  primary: '#8B5CF6',
  primaryForeground: '#FFFFFF',

  // Secondary
  secondary: '#1E1E2E',
  secondaryForeground: '#FFFFFF',

  // Accent - White for clean monochrome
  accent: '#FFFFFF',
  accentForeground: '#000000',

  // Backgrounds
  background: '#000000',
  foreground: '#FFFFFF',

  // Muted
  muted: '#27272A',
  mutedForeground: '#A1A1AA',

  // Destructive (errors)
  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',

  // Borders and inputs
  border: '#27272A',
  input: '#27272A',
  ring: '#8B5CF6',
};

/**
 * Alternative color schemes
 */
export const LUX_COLORS_LIGHT: BrandColors = {
  ...LUX_COLORS,
  background: '#FFFFFF',
  foreground: '#0D0D0D',
  secondary: '#F4F4F5',
  secondaryForeground: '#0D0D0D',
  muted: '#F4F4F5',
  mutedForeground: '#71717A',
  border: '#E4E4E7',
  input: '#E4E4E7',
};

/**
 * Lux Financial typography
 */
export const LUX_TYPOGRAPHY: BrandTypography = {
  fontFamily: {
    heading: '"Inter", "SF Pro Display", system-ui, sans-serif',
    body: '"Inter", "SF Pro Text", system-ui, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", monospace',
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

/**
 * Lux Financial assets paths
 */
export const LUX_ASSETS: BrandAssets = {
  logo: {
    primary: '/images/lux-logo.svg',
    white: '/images/lux-logo-white.svg',
    dark: '/images/lux-logo-dark.svg',
    icon: '/images/lux-icon.svg',
    wordmark: '/images/lux-wordmark.svg',
  },
  favicon: {
    ico: '/favicon.ico',
    svg: '/favicon.svg',
    png16: '/favicon-16x16.png',
    png32: '/favicon-32x32.png',
    png192: '/android-chrome-192x192.png',
    png512: '/android-chrome-512x512.png',
    appleTouchIcon: '/apple-touch-icon.png',
  },
};

/**
 * Lux Financial social links
 */
export const LUX_SOCIAL: BrandSocial = {
  twitter: 'https://twitter.com/luxfinance',
  linkedin: 'https://linkedin.com/company/luxfinance',
  github: 'https://github.com/luxfi',
  discord: 'https://discord.gg/luxfinance',
  telegram: 'https://t.me/luxfinance',
};

/**
 * Default URL surface, derived from the default `lux.financial` domain.
 * Tenant configs override any of these directly.
 */
const DEFAULT_URLS: BrandUrls = {
  site: 'https://lux.financial',
  app: 'https://app.lux.financial',
  appRegistration: 'https://app.lux.financial/registration',
  appLogin: 'https://app.lux.financial/login',
  docs: 'https://docs.lux.financial',
  apiReference: 'https://docs.lux.financial/docs/api-reference-full',
  status: 'https://status.lux.financial',
  schedule: 'https://cal.com/luxfi',
  parent: 'https://luxindustries.xyz',
};

/**
 * Default per-role contact emails.
 */
const DEFAULT_CONTACT_EMAILS: BrandContactEmails = {
  general:    'hello@lux.financial',
  support:    'support@lux.financial',
  sales:      'sales@lux.financial',
  press:      'press@lux.financial',
  security:   'security@lux.financial',
  compliance: 'compliance@lux.financial',
  legal:      'legal@lux.financial',
  careers:    'careers@lux.financial',
};

const DEFAULT_COPYRIGHT: BrandCopyright = {
  holder: 'Lux Financial',
  attributionText: 'By Lux Industries',
  startYear: 2016,
};

/**
 * Derive default URLs from a domain set.
 * Used when a tenant supplies `domains` without `urls`.
 */
function deriveUrls(domains: BrandConfig['domains']): BrandUrls {
  const primary = `https://${domains.primary}`;
  const app     = `https://${domains.app}`;
  const docs    = domains.docs   ? `https://${domains.docs}`   : `${primary}/docs`;
  const status  = domains.status ? `https://${domains.status}` : `${primary}/status`;
  return {
    site: primary,
    app,
    appRegistration: `${app}/registration`,
    appLogin: `${app}/login`,
    docs,
    apiReference: `${docs}/docs/api-reference-full`,
    status,
    schedule: DEFAULT_URLS.schedule,
    parent: DEFAULT_URLS.parent,
  };
}

/**
 * Derive default emails from a primary domain.
 */
function deriveContactEmails(primary: string): BrandContactEmails {
  return {
    general:    `hello@${primary}`,
    support:    `support@${primary}`,
    sales:      `sales@${primary}`,
    press:      `press@${primary}`,
    security:   `security@${primary}`,
    compliance: `compliance@${primary}`,
    legal:      `legal@${primary}`,
    careers:    `careers@${primary}`,
  };
}

/**
 * Merge a partial tenant override on top of a base brand config.
 * Object-level deep merge for `colors`, `typography`, `assets`,
 * `domains`, `urls`, `contactEmails`, `copyright`, `social`.
 */
function mergeBrand(base: BrandConfig, overrides?: Partial<BrandConfig>): BrandConfig {
  if (!overrides) return base;
  const domains = { ...base.domains, ...(overrides.domains ?? {}) };
  // If the tenant changed `domains.primary` but did not supply explicit urls /
  // emails, derive them from the new primary so they stay consistent.
  const tenantChangedPrimary =
    overrides.domains?.primary && overrides.domains.primary !== base.domains.primary;
  const derivedUrls   = tenantChangedPrimary ? deriveUrls(domains) : base.urls;
  const derivedEmails = tenantChangedPrimary ? deriveContactEmails(domains.primary) : base.contactEmails;
  return {
    ...base,
    ...overrides,
    domains,
    colors:        { ...base.colors,        ...(overrides.colors        ?? {}) },
    typography:    { ...base.typography,    ...(overrides.typography    ?? {}) },
    assets:        { ...base.assets,        ...(overrides.assets        ?? {}) },
    urls:          { ...derivedUrls,        ...(overrides.urls          ?? {}) },
    contactEmails: { ...derivedEmails,      ...(overrides.contactEmails ?? {}) },
    copyright:     { ...base.copyright,     ...(overrides.copyright     ?? {}) },
    social:        { ...base.social,        ...(overrides.social        ?? {}) },
  };
}

/**
 * Read a tenant override from process.env, if present:
 *
 *   LUX_BRAND_INLINE     — JSON string, optionally base64-encoded
 *   LUX_BRAND_OVERRIDE   — path to a JSON file, resolved relative to CWD
 *
 * `LUX_BRAND_INLINE` takes precedence. Failure to parse is loud — we
 * throw so a misconfigured tenant build fails fast rather than silently
 * shipping the wrong brand.
 *
 * Module is loaded by Next at build time on the server; file IO is only
 * attempted when running under Node (typeof process !== 'undefined' and
 * fs is available). In the browser this is a no-op.
 */
function readTenantOverride(): Partial<BrandConfig> | undefined {
  if (typeof process === 'undefined' || !process.env) return undefined;

  // Next.js inlines `process.env.LUX_BRAND_INLINE` into the client bundle
  // when listed under `env` in next.config.js, so the tenant override
  // survives into both server and browser bundles.
  const inline = process.env.LUX_BRAND_INLINE;
  if (inline && inline.length > 0) {
    const decoded = /^[A-Za-z0-9+/=\s]+$/.test(inline) && !inline.trim().startsWith('{')
      ? (typeof Buffer !== 'undefined'
          ? Buffer.from(inline, 'base64').toString('utf8')
          : atob(inline))
      : inline;
    return JSON.parse(decoded) as Partial<BrandConfig>;
  }

  // File reads only happen on the server (and only when fs is available).
  // We use `eval('require')` so bundlers (webpack, Next.js) do not try to
  // resolve `fs`/`path` into the client bundle.
  const overridePath = process.env.LUX_BRAND_OVERRIDE;
  if (overridePath && overridePath.length > 0 && typeof window === 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-eval
      const req = eval('require') as NodeRequire;
      const fs = req('fs') as typeof import('fs');
      const pathMod = req('path') as typeof import('path');
      const resolved = pathMod.isAbsolute(overridePath)
        ? overridePath
        : pathMod.resolve(process.cwd(), overridePath);
      const body = fs.readFileSync(resolved, 'utf8');
      return JSON.parse(body) as Partial<BrandConfig>;
    } catch {
      // If LUX_BRAND_OVERRIDE is set on the server but unreadable, fail
      // fast — a misconfigured tenant build should not silently ship the
      // default Lux brand.
      throw new Error(
        `@luxbank/brand: failed to read tenant override at ${overridePath}`,
      );
    }
  }

  return undefined;
}

/**
 * Create a complete brand configuration.
 *
 * Resolution order (last wins):
 *   1. Built-in Lux defaults
 *   2. Tenant override from env (`LUX_BRAND_INLINE` or `LUX_BRAND_OVERRIDE`)
 *   3. Explicit `overrides` argument
 */
export function createBrandConfig(
  jurisdictionCode = DEFAULT_JURISDICTION,
  overrides?: Partial<BrandConfig>
): BrandConfig {
  const jurisdiction = getJurisdiction(jurisdictionCode);

  const base: BrandConfig = {
    // Core identity
    name: 'Lux Financial',
    legalName: jurisdiction.legalEntity.name,
    productName: 'Lux',
    tagline: 'White-Label Banking Infrastructure',
    description:
      'Lux Financial provides enterprise-grade white-label banking infrastructure for fintechs, neobanks, and financial institutions. Modern APIs, multi-currency support, and seamless integrations.',

    // Visual identity
    colors: LUX_COLORS,
    typography: LUX_TYPOGRAPHY,
    assets: LUX_ASSETS,

    // Digital presence
    domains: {
      primary: 'lux.financial',
      app:     'app.lux.financial',
      admin:   'admin.lux.financial',
      api:     'api.lux.financial',
      docs:    'docs.lux.financial',
      support: 'support.lux.financial',
      status:  'status.lux.financial',
    },

    urls: DEFAULT_URLS,
    contactEmails: DEFAULT_CONTACT_EMAILS,
    copyright: DEFAULT_COPYRIGHT,

    // Social
    social: LUX_SOCIAL,

    // Active jurisdiction
    jurisdiction,

    // Available jurisdictions
    availableJurisdictions: [
      'US_FEDERAL', 'US_STATE', 'US_TRUST', 'US_SPONSORED',
      'UK_FCA', 'UK_IOM',
      'EU_IRELAND', 'EU_LITHUANIA',
      'SG_MAS',
      'HK_SFC',
      'AU_ASIC',
      'CA_FINTRAC',
      'UAE_DFSA', 'UAE_ADGM',
    ],
  };

  const fromEnv  = readTenantOverride();
  const withEnv  = mergeBrand(base, fromEnv);
  const withArgs = mergeBrand(withEnv, overrides);
  return withArgs;
}

/**
 * Default brand configuration. Tenant overrides from
 * `LUX_BRAND_INLINE` / `LUX_BRAND_OVERRIDE` are applied here.
 */
export const LUX_BRAND = createBrandConfig();

/**
 * Export commonly used configurations
 */
export const BRAND_NAME = LUX_BRAND.name;
export const BRAND_TAGLINE = LUX_BRAND.tagline;
export const BRAND_DESCRIPTION = LUX_BRAND.description;
