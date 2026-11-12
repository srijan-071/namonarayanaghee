import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import ElvishYadavGheeContent from "@/components/seo/ElvishYadavGheeContent";

export const metadata: Metadata = {
  title: `Elvish Yadav & Namo Narayana Ghee: Official Association & Prices`,
  description:
    "The official story of Elvish Yadav and Namo Narayana Ghee. Verified co-founder role, July 2026 brand launch, authentic prices, and official store details.",
  alternates: {
    canonical: absoluteUrl("/elvish-yadav-ghee"),
  },
  openGraph: {
    title: "Elvish Yadav & Namo Narayana Ghee: Official Story & Prices",
    description:
      "Learn about the verified relationship between Elvish Yadav and Namo Narayana Ghee. Official launch, FSSAI lab standards, and authentic rates.",
    url: absoluteUrl("/elvish-yadav-ghee"),
    type: "article",
    images: [
      {
        url: absoluteUrl("/assets/product_Elvish_slide.webp"),
        width: 1200,
        height: 630,
        alt: "Elvish Yadav presenting Namo Narayana Pure A2 Gir Cow Ghee",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elvish Yadav & Namo Narayana Ghee: Official Association",
    description:
      "Verified details on Elvish Yadav's launch of Namo Narayana Pure A2 Gir Cow Bilona Ghee.",
    images: [absoluteUrl("/assets/product_Elvish_slide.webp")],
  },
};

export default function ElvishYadavPage() {
  const pageUrl = absoluteUrl("/elvish-yadav-ghee");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        "url": pageUrl,
        "name": "Elvish Yadav & Namo Narayana Ghee: Official Association & Prices",
        "description":
          "The official story behind Elvish Yadav's launch of Namo Narayana Ghee in July 2026, authentic products, and verified rates.",
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
              "name": "Elvish Yadav Ghee",
              "item": pageUrl,
            },
          ],
        },
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        "isPartOf": { "@id": `${pageUrl}#webpage` },
        "headline": "Namo Narayana Ghee and Elvish Yadav: Verified Brand Association & Official Story",
        "description":
          "The official story behind Elvish Yadav's launch of Namo Narayana Ghee in July 2026, authentic products, and verified rates.",
        "image": [
          absoluteUrl("/assets/product_Elvish_slide.webp"),
          absoluteUrl("/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"),
        ],
        "datePublished": "2026-07-28T12:00:00+05:30",
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
            "name": "How is Elvish Yadav related to Namo Narayana Ghee?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Elvish Yadav is the official co-founder and chief brand promoter of Namo Narayana Ghee, having launched the brand on July 28, 2026, to provide Indian consumers with authentic, unadulterated A2 Gir Cow Bilona Ghee.",
            },
          },
          {
            "@type": "Question",
            "name": "Does Elvish Yadav personally use and endorse this ghee?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes. Elvish Yadav has frequently shared on his official media channels that Namo Narayana Ghee was created to mirror the pure, traditional dairy his family consumed in Haryana, emphasizing the traditional curd-churning Bilona process and indigenous Gir cow milk.",
            },
          },
          {
            "@type": "Question",
            "name": "What is the official price of Elvish Yadav's Ghee?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "On the official store (namonarayanaghee.store), the verified rates are: 500ml at ₹799, 1 Litre flagship at ₹1,299, 2.5 Litres at ₹2,699, and 5 Litres at ₹4,499. All orders include complimentary pan-India delivery.",
            },
          },
          {
            "@type": "Question",
            "name": "How can I make sure I am ordering the genuine product?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Always ensure your web browser is on https://www.namonarayanaghee.store/. Do not place orders via unverified third-party websites or informal social media payment links. Every authentic parcel is shipped with tamper-evident holographic seals and FSSAI Lic. No. 20824005000185.",
            },
          },
          {
            "@type": "Question",
            "name": "What payment methods are supported on the official store?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "To ensure contactless, tamper-proof logistics and avoid transit delays, Namo Narayana operates exclusively on 100% secure prepaid orders. We support UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards, and Net Banking with end-to-end 256-bit SSL encryption.",
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
      <ElvishYadavGheeContent />
    </>
  );
}
