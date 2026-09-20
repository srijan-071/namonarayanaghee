import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import Link from "next/link";
import { Leaf, ShieldCheck, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: `A2 Ghee Buying Guide: Facts, Differences & Purity | ${siteConfig.name}`,
  description: "Learn what A2 ghee is, the difference between A2 and conventional ghee, how the Bilona process works, and what to check before buying pure A2 Gir Cow ghee.",
  alternates: {
    canonical: absoluteUrl("/a2-ghee-guide"),
  },
  openGraph: {
    title: "A2 Ghee Buying Guide",
    description: "Learn what A2 ghee is, the difference between A2 and conventional ghee, and how the Bilona process works.",
    url: absoluteUrl("/a2-ghee-guide"),
    type: "article",
  },
};

export default function A2GheeGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The Complete Guide to A2 Ghee and the Bilona Process",
    description: "Learn what A2 ghee is, the difference between A2 and conventional ghee, and what to check before buying pure A2 Gir Cow ghee.",
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
        <div className="nn-container max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-2 text-nn-copper mb-4">
              <Leaf className="w-5 h-5" />
              <span className="uppercase tracking-widest text-sm font-semibold">Educational Guide</span>
            </div>
            <h1 className="nn-title text-4xl md:text-5xl lg:text-6xl mb-6">
              The Complete Guide to A2 Ghee
            </h1>
            <p className="nn-sub text-lg max-w-2xl mx-auto">
              Understanding A2 milk proteins, the traditional Bilona churning process, and how to evaluate purity before you buy.
            </p>
          </div>

          <div className="prose prose-lg md:prose-xl max-w-none text-nn-bark">
            <h2>What Is A2 Ghee?</h2>
            <p>
              A2 ghee is ghee made from milk containing the <strong>A2 beta-casein protein</strong> variant. 
              The term describes the milk protein profile of the cows, not a separate method of making ghee. 
              Historically, native Indian cattle breeds (like Gir and Sahiwal) naturally produce milk containing primarily the A2 protein.
            </p>

            <h2>What Does A2 Refer To?</h2>
            <p>
              Cow's milk contains different types of proteins, one of which is beta-casein. Beta-casein comes in two primary forms: A1 and A2. 
              The structural difference between these two proteins is tiny-a single amino acid variation-but studies suggest it affects how the protein is broken down during digestion. 
              Many people who experience mild digestive discomfort from regular (A1) milk find A2 milk products easier to digest.
            </p>

            <div className="bg-nn-cream p-8 rounded-2xl my-10">
              <h3 className="mt-0 text-nn-earth">What is A2 Gir Cow Ghee?</h3>
              <p className="mb-0">
                This refers specifically to ghee made from the milk of the <strong>Gir cow</strong>, a prominent Bos indicus breed native to the Gir hills and forests of Kathiawar in Gujarat, India. Gir cows are renowned for their hardiness, distinctive appearance, and the high quality of their A2 milk.
              </p>
            </div>

            <h2>What is Bilona Ghee?</h2>
            <p>
              Bilona refers to the traditional wooden churner used to make butter from curd (yogurt). 
              Ghee made using the Bilona method involves a multi-step process:
            </p>
            <ol>
              <li>Boiling whole A2 milk and letting it cool.</li>
              <li>Culturing the milk with a starter to make curd (Dahi) overnight.</li>
              <li>Churning the curd using a wooden Bilona to separate the butter (Makkhan).</li>
              <li>Slow-heating the butter in a thick-bottomed vessel to evaporate moisture, leaving pure clarified butter fat (Ghee).</li>
            </ol>

            <div className="grid md:grid-cols-2 gap-8 my-12">
              <div className="border border-nn-earth/20 rounded-xl p-6">
                <h3 className="text-xl mt-0">A2 vs Conventional Ghee</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-nn-copper shrink-0" />
                    <span><strong>Source:</strong> A2 ghee is from native breeds; conventional is often from crossbred or European breeds (A1 or A1/A2 mix).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-nn-copper shrink-0" />
                    <span><strong>Digestion:</strong> A2 protein structure is generally considered easier to digest.</span>
                  </li>
                </ul>
              </div>
              <div className="border border-nn-earth/20 rounded-xl p-6">
                <h3 className="text-xl mt-0">Bilona vs Direct-Cream</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-nn-copper shrink-0" />
                    <span><strong>Process:</strong> Bilona uses cultured curd; commercial ghee often uses direct cream separation via machines.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-nn-copper shrink-0" />
                    <span><strong>Nutrients & Taste:</strong> Culturing the curd produces beneficial acids and a distinct, rich aroma lost in direct-cream processing.</span>
                  </li>
                </ul>
              </div>
            </div>

            <h2>What Should You Check Before Buying?</h2>
            <p>To ensure you are getting genuine quality, consider these factors:</p>
            <ul>
              <li><strong>Breed Verification:</strong> Does the brand specify the breed (e.g., Gir, Sahiwal)?</li>
              <li><strong>Process Transparency:</strong> Do they explicitly state the cultured Bilona method, or do they just say "pure ghee"?</li>
              <li><strong>Label Reading:</strong> Check the ingredient list. It should be a single ingredient: Milk Fat from A2 milk. There should be no added colors, flavors, or preservatives.</li>
              <li><strong>Aroma and Texture:</strong> Authentic Bilona ghee has a granular (danedar) texture and a rich, nutty aroma. It melts at body temperature.</li>
            </ul>

            <hr className="my-12 border-nn-earth/20" />

            <h2>Namo Narayana's Process</h2>
            <p>
              At Namo Narayana, we follow the authentic Vedic Bilona method. We source milk exclusively from free-grazing Gir cows. We culture the milk into curd, churn it to extract butter, and slow-cook it in brass vessels over a wood fire. We believe in transparency and invite you to explore our <Link href="/bilona-ghee" className="text-nn-copper font-bold hover:underline">Bilona process page</Link> for detailed steps.
            </p>

            <div className="bg-nn-bark text-white p-8 md:p-12 rounded-3xl mt-12 text-center">
              <ShieldCheck className="w-12 h-12 text-nn-copper mx-auto mb-6" />
              <h3 className="text-3xl font-serif mt-0 mb-4 text-white">Experience Authentic A2 Ghee</h3>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                Available in multiple pack sizes to suit your family's needs. Delivered directly from our farm to your table.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/products/pure-desi-cow-ghee-1-litre" className="nn-btn-primary bg-nn-copper text-white hover:bg-white hover:text-nn-bark border-none">
                  Shop 1 Litre
                </Link>
                <Link href="/collections/ghee" className="nn-btn-secondary border-white text-white hover:bg-white hover:text-nn-bark">
                  View All Sizes
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
