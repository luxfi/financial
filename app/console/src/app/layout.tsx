import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import { LUX_BRAND } from "@luxbank/brand";
import Providers from "@/providers";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: `${LUX_BRAND.name} Console`,
  description: `${LUX_BRAND.name} account console — accounts, cards, crypto, FX, compliance.`,
  robots: "noindex, nofollow",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
