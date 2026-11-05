import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import PriceBuyingGuideContent from "@/components/seo/PriceBuyingGuideContent";

export const metadata: Metadata = {
  title: `Namo Narayana Ghee Price (2026): Pack Sizes, Current Rates & Buying Guide`,
  description:
    "Official 2026 Namo Narayana Ghee price guide. Compare verified rates: 500ml (₹599), 1L (₹949), 2.5L (₹2,099), 5L (₹3,499). Free shipping, COD & buying tips.",
  alternates: {
    canonical: absoluteUrl("/pages/namo-narayana-ghee-price-buying-guide"),
  },
  openGraph: {
    title: "Namo Narayana Ghee Price: Pack Sizes & Buying Guide (2026)",
    description:
      "Official rates for authentic Namo Narayana A2 Gir Cow Ghee: 500ml (₹599), 1L (₹949), 2.5L (₹2,099), 5L (₹3,499). Free shipping & COD options.",
    url: absoluteUrl("/pages/namo-narayana-ghee-price-buying-guide"),
    type: "article",
    images: [
      {
        url: absoluteUrl("/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"),
        width: 1200,
        height: 630,
        alt: "Namo Narayana Ghee Price and Pack Sizes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Namo Narayana Ghee Price (2026): Pack Sizes & Buying Guide",
    description:
      "Official verified rates for Namo Narayana A2 Gir Cow Ghee. 500ml (₹599), 1L (₹949), 2.5L (₹2,099), 5L (₹3,499).",
    images: [absoluteUrl("/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp")],
  },
};

export default function PriceBuyingGuidePage() {
  const pageUrl = absoluteUrl("/pages/namo-narayana-ghee-price-buying-guide");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        "url": pageUrl,
        "name": "Namo Narayana Ghee Price (2026): Pack Sizes, Current Rates & Buying Guide",
        "description":
          "Verified official pricing, per-litre economics, pack recommendations, and step-by-step ordering instructions for authentic A2 Gir Cow Bilona Ghee.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${siteConfig.url}/#website`,
          "name": siteConfig.name,
          "url": siteConfig.url,
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "@id": `${pageUrl}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": siteConfig.url,
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Ghee",
              "item": `${siteConfig.url}/collections/ghee`,
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Price & Buying Guide",
              "item": pageUrl,
            },
          ],
        },
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        "isPartOf": { "@id": `${pageUrl}#webpage` },
        "headline": "Namo Narayana Ghee Price (2026): Pack Sizes, Current Rates & Official Buying Guide",
        "description":
          "Comprehensive verified price guide for Namo Narayana Pure A2 Gir Cow Bilona Ghee across 500ml, 1L, 2.5L, and 5L packs.",
        "image": [
          absoluteUrl("/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"),
          absoluteUrl("/assets/hero-new-cows.jpg"),
        ],
        "datePublished": "2026-11-05T09:00:00+05:30",
        "dateModified": "2026-11-05T20:00:00+05:30",
        "author": {
          "@type": "Organization",
          "name": "Namo Narayana Editorial Desk",
          "url": siteConfig.url,
        },
        "publisher": {
          "@type": "Organization",
          "@id": `${siteConfig.url}/#organization`,
          "name": "Namo Narayana",
          "url": siteConfig.url,
          "logo": {
            "@type": "ImageObject",
            "url": absoluteUrl("/assets/logo.png"),
          },
        },
        "mainEntityOfPage": pageUrl,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the official price of Namo Narayana Ghee 1 Litre?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "The verified price for the 1 Litre flagship glass jar of Namo Narayana Pure A2 Gir Cow Bilona Ghee is ₹949.00 on the official store (namonarayanaghee.store). This includes free courier delivery across India.",
            },
          },
          {
            "@type": "Question",
            "name": "Why does authentic Bilona Ghee cost more than supermarket ghee?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Commercial ghee is made by skimming raw cream using motorized factory centrifuges from mixed cow and buffalo milk (requiring only 10–12 litres of milk). Namo Narayana uses the traditional Vedic Bilona method: fresh A2 milk is cultured into curd, churned with wooden bilonas to separate makkhan, and slow-simmered on low heat. This requires 25 to 30 litres of pure Gir cow milk per litre of ghee, establishing a true production cost baseline.",
            },
          },
          {
            "@type": "Question",
            "name": "Are shipping and courier delivery free on all orders?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. Namo Narayana provides 100% complimentary pan-India express courier shipping on all orders, from a single 500ml jar to multiple 5L bulk tins.",
            },
          },
          {
            "@type": "Question",
            "name": "How does Cash on Delivery (COD) work on the official store?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "To eliminate automated bot orders and reduce parcel transit rejections, Cash on Delivery requires a nominal ₹250 booking advance paid online at checkout. The remaining balance is paid directly to the courier executive upon physical delivery at your doorstep.",
            },
          },
          {
            "@type": "Question",
            "name": "Can I convert my COD order to prepaid later for a discount?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes! When you track your order on the /track-order page, if your order is confirmed via COD, you can choose to prepay the remaining balance before it reaches your city. Doing so completely waives the ₹250 COD handling fee and provides an additional 10% discount on the remaining payment.",
            },
          },
          {
            "@type": "Question",
            "name": "Where should I buy to avoid counterfeit or outdated pricing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Always purchase exclusively on https://www.namonarayanaghee.store/. Unauthorized third-party aggregators and unverified domains often list outdated prices (such as ₹1,249 or ₹2,350) or do not dispatch genuine FSSAI-sealed batches.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PriceBuyingGuideContent />
    </>
  );
}

