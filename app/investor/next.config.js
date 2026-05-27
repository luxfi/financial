/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  transpilePackages: ['@luxfi/logo', '@luxbank/brand', 'geist'],
  images: { unoptimized: true },
  output: process.env.STATIC_EXPORT ? 'export' : 'standalone',
  compress: true,
};
module.exports = nextConfig;
