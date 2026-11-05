import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import AboutUsContent from "@/components/seo/AboutUsContent";

export const metadata: Metadata = {
  title: `Who Owns Namo Narayana Ghee? Founder, Brand & Company Facts`,
  description:
    "Factual guide to Namo Narayana Ghee ownership: Co-founder & promoter Elvish Yadav, company registration, FSSAI licensing, and verified brand facts.",
  alternates: {
    canonical: absoluteUrl("/pages/about-us"),
  },
  openGraph: {
    title: "Who Owns Namo Narayana Ghee? Brand & Founder Facts",
    description:
      "Learn about Namo Narayana Ghee ownership: Co-founder & promoter Elvish Yadav, FSSAI Lic. No. 20824005000185, and authentic Vedic heritage.",
    url: absoluteUrl("/pages/about-us"),
    type: "article",
    images: [
      {
        url: absoluteUrl("/assets/hero-new-cows.jpg"),
        width: 1200,
        height: 630,
        alt: "Namo Narayana Gir Cow Dairy Gaushala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Who Owns Namo Narayana Ghee? Brand & Company Facts",
    description:
      "Verified details on Namo Narayana Ghee, co-founded and promoted by Elvish Yadav with FSSAI certification.",
    images: [absoluteUrl("/assets/hero-new-cows.jpg")],
  },
};

export default function AboutUsPage() {
  const pageUrl = absoluteUrl("/pages/about-us");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${pageUrl}#webpage`,
        "url": pageUrl,
        "name": "Who Owns Namo Narayana Ghee? Brand, Founder & Company Facts",
        "description":
          "Verified corporate details, founder background, FSSAI licensing, sourcing philosophy, and official customer grievance channels for Namo Narayana.",
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
              "name": "About Us",
              "item": pageUrl,
            },
          ],
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        "name": "Namo Narayana",
        "url": siteConfig.url,
        "logo": absoluteUrl("/assets/logo.png"),
        "founder": {
          "@type": "Person",
          "name": "Elvish Yadav",
          "jobTitle": "Co-Founder & Promoter",
          "sameAs": "https://www.instagram.com/elvish_yadav/",
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-89300-88005",
          "contactType": "customer service",
          "email": "care@namonarayanaghee.store",
          "availableLanguage": ["en", "hi"],
        },
        "sameAs": [
          "https://www.instagram.com/namonarayanaghee/",
          "https://www.facebook.com/namonarayanaghee/",
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
      <AboutUsContent />
    </>
  );
}

