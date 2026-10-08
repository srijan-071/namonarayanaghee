import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import Bestsellers from "@/components/home/Bestsellers";

export const metadata: Metadata = {
  title: `Elvish Yadav Ghee - Namo Narayana Association`,
  description: "Learn about the factual relationship between Elvish Yadav and the Namo Narayana brand. Elvish Yadav launched the Namo Narayana brand in July 2026.",
  alternates: {
    canonical: absoluteUrl("/elvish-yadav-ghee"),
  },
  openGraph: {
    title: "Elvish Yadav and Namo Narayana Ghee",
    description: "Learn about the factual relationship between Elvish Yadav and the Namo Narayana brand.",
    url: absoluteUrl("/elvish-yadav-ghee"),
    type: "article",
  },
};

export default function ElvishYadavPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How is Elvish Yadav related to Namo Narayana Ghee?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Elvish Yadav launched the Namo Narayana brand in July 2026. He is a promoter and co-founder of the brand."
        }
      },
      {
        "@type": "Question",
        "name": "Does Elvish Yadav own Namo Narayana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Elvish Yadav is a co-founder and promoter of the Namo Narayana brand, which was officially launched in July 2026."
        }
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="bg-white">
        <div className="pt-24 pb-12 bg-nn-cream text-center">
          <div className="nn-container max-w-3xl">
            <h1 className="nn-title text-4xl md:text-5xl lg:text-6xl mb-6">
              Elvish Yadav & Namo Narayana
            </h1>
            <p className="nn-sub text-lg">
              The official story behind the brand's launch.
            </p>
          </div>
        </div>

        <div className="nn-container max-w-4xl py-16 prose prose-lg md:prose-xl text-nn-bark">
          <h2>The Launch of Namo Narayana</h2>
          <p>
            Namo Narayana is a premium D2C brand focused on traditional Indian goods. The brand was officially launched by <strong>Elvish Yadav</strong> in <strong>July 2026</strong>. 
          </p>
          <p>
            As a promoter and co-founder, Elvish Yadav has been instrumental in bringing the vision of pure, traditional products to the market. We believe in transparency and authenticity, which is why we clearly state the relationship between our brand and its founders.
          </p>
          
          <h2>Frequently Asked Questions</h2>
          <div className="not-prose mt-8 space-y-6">
            <div className="bg-nn-cream p-6 rounded-lg">
              <h3 className="text-xl font-bold font-heading mb-2">How is Elvish Yadav related to Namo Narayana Ghee?</h3>
              <p className="text-nn-bark">Elvish Yadav launched the Namo Narayana brand in July 2026. He is a promoter and co-founder of the brand.</p>
            </div>
            <div className="bg-nn-cream p-6 rounded-lg">
              <h3 className="text-xl font-bold font-heading mb-2">Does Elvish Yadav own Namo Narayana?</h3>
              <p className="text-nn-bark">Yes, Elvish Yadav is a co-founder and promoter of the Namo Narayana brand, working alongside dedicated farmers to provide authentic products.</p>
            </div>
          </div>
        </div>

        <Bestsellers />
      </main>
    </>
  );
}
