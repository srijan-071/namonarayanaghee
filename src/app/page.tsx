import { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ProofStrip from "@/components/home/ProofStrip";
import Bestsellers from "@/components/home/Bestsellers";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import BilonaProcess from "@/components/home/BilonaProcess";
import FarmSourcing from "@/components/home/FarmSourcing";
import LabComplianceProof from "@/components/home/LabComplianceProof";
import HomeReviews from "@/components/home/HomeReviews";
import ElvishAssociationModule from "@/components/home/ElvishAssociationModule";
import GheeRecipes from "@/components/home/GheeRecipes";
import HomeFAQ from "@/components/home/HomeFAQ";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: absoluteUrl("/assets/hero-new-cows.jpg"), width: 1200, height: 630 }],
    type: "website",
  },
};

export default function HomePage() {
  const orgSchema = generateOrganizationSchema();
  const webSchema = generateWebSiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSchema) }}
      />
      <div className="flex flex-col w-full overflow-x-clip bg-[#FAF8F5]">
        {/* 02. Hero / Above the Fold */}
        <Hero />

        {/* 03. Verifiable Proof Strip */}
        <ProofStrip />

        {/* 04. Bestseller Collection Packs */}
        <div id="bestsellers" className="cv-auto scroll-mt-16">
          <Bestsellers />
        </div>

        {/* 05. Key Differentiators & Why Choose Us */}
        <div className="cv-auto">
          <WhyChooseUs />
        </div>

        {/* 06. Traditional Vedic Bilona Process Story */}
        <div id="bilona-process" className="cv-auto scroll-mt-16">
          <BilonaProcess />
        </div>

        {/* 07. Ethical Gaushala Sourcing & Farm Evidence */}
        <div className="cv-auto">
          <FarmSourcing />
        </div>

        {/* 08. NABL Lab Compliance & FARE Labs Report Proof */}
        <div className="cv-auto">
          <LabComplianceProof />
        </div>

        {/* 09. Real Customer Proof & Verified Reviews */}
        <div className="cv-auto">
          <HomeReviews />
        </div>

        {/* 10. Creator Association & Official Store Verification */}
        <div className="cv-auto">
          <ElvishAssociationModule />
        </div>

        {/* 11. Practical Culinary Recipes & Everyday Usage */}
        <div className="cv-auto">
          <GheeRecipes />
        </div>

        {/* 12. Pre-Purchase FAQs */}
        <div className="cv-auto">
          <HomeFAQ />
        </div>
      </div>
    </>
  );
}
