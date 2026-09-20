import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import BilonaProcess from "@/components/home/BilonaProcess";

export const metadata: Metadata = {
  title: `The Bilona Method: How We Make Our Ghee | ${siteConfig.name}`,
  description: "Learn about the traditional Bilona churning process used to make Namo Narayana A2 Gir Cow Ghee.",
  alternates: {
    canonical: absoluteUrl("/bilona-ghee"),
  },
  openGraph: {
    title: "The Traditional Bilona Method",
    description: "Learn about the traditional Bilona churning process used to make Namo Narayana A2 Gir Cow Ghee.",
    url: absoluteUrl("/bilona-ghee"),
    type: "article",
  },
};

export default function BilonaGheePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The Bilona Method: How We Make Our Ghee",
    description: "Learn about the traditional Bilona churning process used to make Namo Narayana A2 Gir Cow Ghee.",
    author: {
      "@type": "Organization",
      name: siteConfig.name
    },
    publisher: {
      "@id": `${siteConfig.url}/#organization`
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="bg-white">
        {/* We can reuse the BilonaProcess component but in a full page context, 
            adding a hero header above it */}
        <div className="pt-24 pb-12 bg-nn-cream text-center">
          <div className="nn-container max-w-3xl">
            <h1 className="nn-title text-4xl md:text-5xl lg:text-6xl mb-6">
              The Bilona Method
            </h1>
            <p className="nn-sub text-lg">
              We preserve the ancient Vedic tradition of ghee-making. Discover why this slow, labor-intensive process is crucial for creating authentic, pure A2 ghee.
            </p>
          </div>
        </div>
        
        <BilonaProcess />
        
        <div className="nn-container max-w-4xl py-16 prose prose-lg md:prose-xl text-nn-bark">
          <h2>Why Bilona?</h2>
          <p>
            In modern commercial ghee production, milk is often directly processed to extract cream, which is then heated to make ghee. While faster and cheaper, this bypasses the essential culturing step. 
          </p>
          <p>
            The Bilona method begins by converting whole milk into curd (yogurt). The culturing process introduces beneficial bacteria, breaking down complex proteins and giving the final ghee its distinct aroma, granular texture, and superior nutritional profile. The curd is then hand-churned in a wooden vessel (the Bilona) to separate the Makhan (butter), which is slowly heated over a wood fire.
          </p>
        </div>
      </main>
    </>
  );
}
