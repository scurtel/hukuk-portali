import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { buildPlatformAboutPageSchemaGraph } from "@/lib/seo/platform";
import { getSiteUrl, siteConfig } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap"
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source-serif",
  display: "swap"
});

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png"
  },
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification
        }
      }
    : {})
};

type RootLayoutProps = {
  children: ReactNode;
};

const siteSchemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": buildPlatformAboutPageSchemaGraph()
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="tr" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: siteSchemaJson }} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
