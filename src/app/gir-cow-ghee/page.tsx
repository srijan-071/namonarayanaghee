import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Gir Cow Ghee: Origin, Benefits & Facts | ${siteConfig.name}`,
  description: "Learn about the Gir Cow, its native habitat in Gujarat, and why its milk is prized for making high-quality A2 ghee.",
  alternates: {
    canonical: absoluteUrl("/gir-cow-ghee"),
  },
  openGraph: {
    title: "Gir Cow Ghee: Origin & Facts",
    description: "Learn about the Gir Cow, its native habitat, and why its milk is prized for making high-quality A2 ghee.",
    url: absoluteUrl("/gir-cow-ghee"),
    type: "article",
  },
};

export default function GirCowGheePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Gir Cow Ghee: Origin, Benefits & Facts",
    description: "Learn about the Gir Cow, its native habitat in Gujarat, and why its milk is prized for making high-quality A2 ghee.",
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
      <main className="bg-white py-16 md:py-24">
        <div className="nn-container max-w-4xl mx-auto prose prose-lg md:prose-xl text-nn-bark">
          <h1 className="nn-title text-center mb-12">The Gir Cow</h1>
          
          <p>
            The Gir cow (Bos indicus) is one of the principal Zebu breeds originating in India. 
            Native to the Gir hills and forests of Kathiawar in Gujarat, these cows are known for their distinct appearance-prominent foreheads, long pendulous ears, and beautifully curved horns.
          </p>

          <h2>Why is Gir Cow Milk Special?</h2>
          <p>
            Gir cows naturally produce milk that is rich in the A2 beta-casein protein. 
            Unlike many crossbred dairy cows that produce A1 or A1/A2 mixed milk, native breeds like the Gir have retained their original genetic profile. 
            This makes their milk highly sought after by those who seek the traditional qualities of Indian dairy.
          </p>

          <h2>Hardy and Resilient</h2>
          <p>
            Bred in a challenging environment, Gir cows are highly resilient to tropical diseases and extreme temperatures. 
            They are known for their calm and affectionate nature. At Namo Narayana, we believe that happy, well-cared-for cows living in a low-stress environment produce the best quality milk.
          </p>

          <h2>From Milk to Ghee</h2>
          <p>
            We use the pure A2 milk from our Gir cows to produce our signature Bilona ghee. The combination of high-quality Gir cow milk and the ancient Vedic churning process results in ghee that is golden, granular, and deeply aromatic.
          </p>
        </div>
      </main>
    </>
  );
}
