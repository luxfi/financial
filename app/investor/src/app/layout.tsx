import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { LUX_BRAND } from '@luxbank/brand';
import './globals.css';

export const metadata: Metadata = {
  title: `${LUX_BRAND.name} Investor`,
  description: `${LUX_BRAND.name} investor portal — positions, documents, communications, audit.`,
  robots: 'noindex, nofollow',
  icons: {
    icon: { url: '/favicon.svg', type: 'image/svg+xml' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
