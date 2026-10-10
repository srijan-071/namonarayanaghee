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
import ExitIntentPopup from "@/components/home/ExitIntentPopup";
import InAppBrowserWarning from "@/components/layout/InAppBrowserWarning";

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
};

import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <AnalyticsProvider>
          <FirebaseProvider>
            <CartDrawerProvider>
              <Toaster position="top-center" duration={2000} richColors />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <ExitIntentPopup />
              <InAppBrowserWarning />
            </CartDrawerProvider>
          </FirebaseProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
