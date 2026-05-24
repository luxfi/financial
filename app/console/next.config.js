/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  compiler: { styledComponents: true },
  transpilePackages: ['@luxfi/logo', '@luxbank/brand', 'geist'],
  images: { unoptimized: true },
  output: process.env.STATIC_EXPORT ? 'export' : 'standalone',
  compress: true,
};
module.exports = nextConfig;
