import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import { LUX_BRAND } from "@luxbank/brand";
import ClientLayout from "./client-layout";

// Default home-page meta. Tenant builds override site identity via
// LUX_BRAND_OVERRIDE / LUX_BRAND_INLINE; the strings below are computed
// from the resolved brand config at build time.
const tagline = "The complete financial platform. Fiat, crypto, stablecoins, digital securities. CEX, DEX, AMM. 200+ countries.";

export const metadata: Metadata = {
  title: LUX_BRAND.name,
  description: tagline,
  openGraph: {
    title: `${LUX_BRAND.name} | Make payments seamlessly, without complexity and at lower costs.`,
    description: tagline,
    url: `${LUX_BRAND.urls.site}/`,
    type: "website",
  },
  robots: "index, follow",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en_GB" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}
