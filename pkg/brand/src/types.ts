/**
 * Brand and Jurisdiction Configuration Types
 * Supports multi-jurisdiction regulatory compliance
 */

// ============================================================================
// Jurisdiction Types
// ============================================================================

export type JurisdictionCode =
  | 'GLOBAL'
  | 'US_FEDERAL' | 'US_STATE' | 'US_TRUST' | 'US_FUND' | 'US_SPONSORED'
  | 'UK_FCA' | 'UK_IOM' | 'UK_GIB'
  | 'EU_GENERIC' | 'EU_IRELAND' | 'EU_MALTA' | 'EU_CYPRUS' | 'EU_LITHUANIA'
  | 'CA_FINTRAC' | 'CA_PROVINCIAL'
  | 'AU_ASIC' | 'AU_AUSTRAC'
  | 'SG_MAS'
  | 'HK_SFC' | 'HK_HKMA'
  | 'UAE_DFSA' | 'UAE_ADGM' | 'UAE_DIFC'
  | 'CUSTOM';

export type LegalEntityType =
  | 'corporation'
  | 'limited_company'
  | 'llc'
  | 'trust'
  | 'fund'
  | 'chartered_bank'
  | 'emi' // Electronic Money Institution
  | 'pi'  // Payment Institution
  | 'mso' // Money Service Operator
  | 'custom';

export interface Address {
  buildingNumber?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  countryCode: string;
}

export interface Regulator {
  name: string;
  shortName: string;
  url?: string;
  licenseNumber?: string;
  licenseType?: string;
}

export interface SponsorBank {
  name: string;
  shortName: string;
  charterType: string;
  fdic: boolean;
  url?: string;
  address?: Address;
}

export interface JurisdictionConfig {
  code: JurisdictionCode;
  name: string;
  country: string;
  countryCode: string;
  currency: string;
  currencySymbol: string;

  // Legal entity details
  legalEntity: {
    type: LegalEntityType;
    name: string;
    shortName?: string;
    tradingName?: string;
    registrationNumber?: string;
    vatNumber?: string;
    incorporationDate?: string;
    registeredAddress: Address;
    businessAddress?: Address;
  };

  // Sponsor bank (for BaaS model)
  sponsorBank?: SponsorBank;

  // Regulatory details
  regulators: Regulator[];

  // Compliance text
  disclaimers: {
    general: string;
    safeguarding?: string;
    risk?: string;
    complaints?: string;
  };

  // Contact for this jurisdiction
  contact: {
    email: string;
    phone?: string;
    supportEmail?: string;
    complianceEmail?: string;
  };
}

// ============================================================================
// Brand Types
// ============================================================================

export interface BrandColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface BrandAssets {
  logo: {
    primary: string;      // Main logo SVG
    white: string;        // White version for dark backgrounds
    dark: string;         // Dark version for light backgrounds
    icon: string;         // Icon-only version
    wordmark?: string;    // Text-only version
  };
  favicon: {
    ico: string;
    svg: string;
    png16: string;
    png32: string;
    png192: string;
    png512: string;
    appleTouchIcon: string;
  };
}

export interface BrandTypography {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };
  fontWeights: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export interface BrandSocial {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
  discord?: string;
  telegram?: string;
  youtube?: string;
}

/**
 * Pre-computed URL/email surfaces every page consumes.
 * Derived from `domains` + `contactEmails` by `createBrandConfig`,
 * but each may be overridden by a tenant config.
 */
export interface BrandUrls {
  // Primary public site (e.g. https://lux.financial)
  site: string;
  // Customer application (e.g. https://app.lux.financial)
  app: string;
  // Customer registration deep-link (e.g. https://app.lux.financial/registration)
  appRegistration: string;
  // Customer login deep-link (e.g. https://app.lux.financial/login)
  appLogin: string;
  // Developer docs (e.g. https://docs.lux.financial)
  docs: string;
  // API reference (e.g. https://docs.lux.financial/docs/api-reference-full)
  apiReference: string;
  // Status page (e.g. https://status.lux.financial)
  status: string;
  // Sales scheduling link (e.g. https://cal.com/luxfi)
  schedule: string;
  // Parent corporate site (e.g. https://luxindustries.xyz)
  parent: string;
}

/**
 * Per-role contact emails — each tenant overrides as needed.
 * If a field is omitted, callers fall back to `general`.
 */
export interface BrandContactEmails {
  general: string;
  support: string;
  sales: string;
  press: string;
  security: string;
  compliance: string;
  legal: string;
  careers: string;
}

export interface BrandCopyright {
  // Full line, e.g. "© 2016-2026 Lux Financial"
  holder: string;
  // Parent attribution line, e.g. "By Lux Industries"
  attributionText: string;
  // Earliest year shown in copyright range
  startYear: number;
}

export interface BrandConfig {
  // Core identity
  name: string;
  legalName: string;
  // Short, capitalized noun used as a product / service name in prose
  // (e.g. "Lux", "Acme Pay"). Defaults to the first word of `name`.
  productName: string;
  tagline: string;
  description: string;

  // Visual identity
  colors: BrandColors;
  typography: BrandTypography;
  assets: BrandAssets;

  // Digital presence
  domains: {
    primary: string;
    app: string;
    admin?: string;
    api?: string;
    docs?: string;
    support?: string;
    status?: string;
  };

  // Pre-computed URLs (override-friendly surface for page code)
  urls: BrandUrls;

  // Per-role contact emails
  contactEmails: BrandContactEmails;

  // Copyright + attribution
  copyright: BrandCopyright;

  // Social links
  social: BrandSocial;

  // Active jurisdiction
  jurisdiction: JurisdictionConfig;

  // Available jurisdictions (for multi-region support)
  availableJurisdictions?: JurisdictionCode[];
}

// ============================================================================
// Email Template Types
// ============================================================================

export interface EmailTemplateContext {
  brand: BrandConfig;
  currentYear: number;
  supportUrl: string;
  privacyUrl: string;
  termsUrl: string;
  unsubscribeUrl?: string;
}
