import { Metadata } from "next";
import Bestsellers from "@/components/home/Bestsellers";
import Hero from "@/components/home/Hero";
import CategoryExperience from "@/components/home/CategoryExperience";
import BrandStory from "@/components/home/BrandStory";
import BilonaProcess from "@/components/home/BilonaProcess";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CinematicCTA from "@/components/home/CinematicCTA";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSchema) }} />
      <main className="flex flex-col w-full overflow-hidden bg-nn-cream">
        <Hero />
        <Bestsellers />
        <CategoryExperience />
        <BrandStory />
        <BilonaProcess />
        <CinematicCTA />
      </main>
    </>
  );
}
