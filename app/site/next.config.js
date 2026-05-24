// White-label brand override resolution.
//
// We resolve the tenant override here (Node-only, build time), inline it
// as LUX_BRAND_INLINE (a JSON string), and then `@luxbank/brand` reads
// the same string from process.env in both server and client bundles.
// That way the client bundle does not need fs access.
const fs = require('fs');
const path = require('path');

function resolveBrandInline() {
  if (process.env.LUX_BRAND_INLINE && process.env.LUX_BRAND_INLINE.length > 0) {
    return process.env.LUX_BRAND_INLINE;
  }
  const overridePath = process.env.LUX_BRAND_OVERRIDE;
  if (overridePath && overridePath.length > 0) {
    const resolved = path.isAbsolute(overridePath)
      ? overridePath
      : path.resolve(process.cwd(), overridePath);
    const body = fs.readFileSync(resolved, 'utf8');
    // Round-trip through JSON to strip comments and validate.
    return JSON.stringify(JSON.parse(body));
  }
  return '';
}

const BRAND_INLINE = resolveBrandInline();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  // White-label brand override surface — picked up by @luxbank/brand at
  // build time. PSPs, banks, and wallets rebuild this same site with
  // their own brand by setting LUX_BRAND_OVERRIDE=./tenant.json or
  // LUX_BRAND_INLINE='{"name":"Acme Pay",...}'.
  // Both server and client bundles read LUX_BRAND_INLINE; LUX_BRAND_OVERRIDE
  // is resolved into LUX_BRAND_INLINE above at build time.
  env: {
    LUX_BRAND_INLINE: BRAND_INLINE,
  },
  transpilePackages: ['@luxfi/logo', '@luxbank/brand', 'geist'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.ghost.org",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
      },
      {
        protocol: "https",
        hostname: "news.dev.lux.financial",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.dev.lux.financial",
        port: "",
      },
    ],
  },
  // Use 'export' for static deployment (Cloudflare Pages, GitHub Pages)
  // Set to 'standalone' for Node.js server deployment
  output: process.env.STATIC_EXPORT ? "export" : "standalone",
  // basePath removed - site deploys to root of custom domain (lux.financial)
  compress: true,
};

module.exports = nextConfig;
