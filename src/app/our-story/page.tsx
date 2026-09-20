import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import BrandStory from "@/components/home/BrandStory";

export const metadata: Metadata = {
  title: `Our Story | ${siteConfig.name}`,
  description: "Learn about Namo Narayana, our farm, our heritage, and our commitment to providing pure, traditional A2 Gir Cow Ghee.",
  alternates: {
    canonical: absoluteUrl("/our-story"),
  },
  openGraph: {
    title: "Our Story",
    description: "Learn about Namo Narayana and our commitment to pure A2 ghee.",
    url: absoluteUrl("/our-story"),
    type: "article",
  },
};

export default function OurStoryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      "@id": `${siteConfig.url}/#organization`
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="bg-white">
        <div className="pt-24 pb-12 bg-nn-cream text-center">
          <div className="nn-container max-w-3xl">
            <h1 className="nn-title text-4xl md:text-5xl lg:text-6xl mb-6">
              Our Story
            </h1>
            <p className="nn-sub text-lg">
              Rooted in tradition, driven by purity.
            </p>
          </div>
        </div>

        <BrandStory />

        <div className="nn-container max-w-4xl py-16 prose prose-lg md:prose-xl text-nn-bark">
          <h2>Who We Are</h2>
          <p>
            Namo Narayana is a premium D2C brand dedicated to bringing the authentic taste and nutritional benefits of traditional Indian dairy to your table. 
            Based in India, we work closely with dedicated farmers to ensure our Gir cows are raised in a natural, stress-free environment.
          </p>
          
          <h2>Our Commitment</h2>
          <p>
            We believe that real food requires no shortcuts. That's why we adhere strictly to the Vedic Bilona method. 
            We never use direct cream or industrial shortcuts. We do not compromise on the quality of our milk or the welfare of our cows.
          </p>

          <h2>Contact Us</h2>
          <p>
            Have questions about our process or our products? We'd love to hear from you.
            <br />
            <strong>Customer Service:</strong> +91-89300-88005
          </p>
        </div>
      </main>
    </>
  );
}
