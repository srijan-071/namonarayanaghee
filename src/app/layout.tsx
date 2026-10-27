import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { CartDrawerProvider } from "@/components/cart/CartDrawerProvider";
import { FirebaseProvider } from "@/components/providers/FirebaseProvider";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import InAppBrowserWarning from "@/components/layout/InAppBrowserWarning";
import DiwaliAmbience from "@/components/ui/DiwaliAmbience";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
  openGraph: {
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    url: siteConfig.url,
    images: [
      {
        url: "/assets/logo.png",
        width: 800,
        height: 800,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: { 
    card: "summary_large_image",
    images: ["/assets/logo.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteConfig.url },
  other: {
    "google-adsense-account": "ca-pub-3806114019541775",
  },
};

import Script from "next/script";
import { Toaster } from 'sonner';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { BotIdClient } from "botid/client";

const protectedBotRoutes = [
  { path: "/api/create-order", method: "POST" },
  { path: "/api/razorpay/*", method: "POST" },
  { path: "/api/payu/*", method: "POST" },
  { path: "/api/verify-payment", method: "POST" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <link rel="preconnect" href="https://namonarayana.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://namonarayana.com" />
        <BotIdClient protect={protectedBotRoutes} />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Script
          id="google-adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3806114019541775"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        <AnalyticsProvider>
          <FirebaseProvider>
            <CartDrawerProvider>
              <Toaster position="top-center" duration={2000} richColors />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <InAppBrowserWarning />
              <DiwaliAmbience />
              <SpeedInsights />
              <Analytics />
            </CartDrawerProvider>
          </FirebaseProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
