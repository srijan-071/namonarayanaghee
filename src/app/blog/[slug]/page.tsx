import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPost, getAllBlogSlugs } from "@/lib/data";
import { generateArticleMetadata, absoluteUrl } from "@/lib/seo";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/config";
import NamoNarayanaGheeReviewContent from "@/components/blog/NamoNarayanaGheeReviewContent";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return generateArticleMetadata(post);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  // If this is our specialized review post, render the rich interactive layout with full schema stack
  if (slug === "namo-narayana-ghee-review") {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": absoluteUrl(`/blog/${slug}#article`),
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        url: siteConfig.url,
      },
      headline: post.title,
      description: post.seo?.description || post.excerpt,
      image: [
        absoluteUrl("/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"),
        absoluteUrl("/assets/hero-new-cows.jpg"),
      ],
      datePublished: "2026-10-28T09:00:00+05:30",
      dateModified: "2026-10-28T18:00:00+05:30",
      mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
      author: {
        "@type": "Organization",
        name: "Namo Narayana Research & Quality Desk",
        url: absoluteUrl("/pages/about-us"),
        founder: {
          "@type": "Person",
          name: "Elvish Yadav",
          jobTitle: "Founder",
          url: "https://www.instagram.com/elvish_yadav/"
        }
      },
      publisher: {
        "@type": "Organization",
        name: "Namo Narayana",
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/assets/logo.png"),
        },
      },
      keywords: [
        "Namo Narayana Ghee Review",
        "Namo Narayana Ghee Price",
        "who is the owner of namo narayan ghee",
        "who is the founder of namo narayan ghee",
        "A2 Gir cow ghee review",
        "bilona ghee review",
        "how to order namo narayan ghee"
      ]
    };

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: post.title, url: `/blog/${slug}` },
    ]);

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Who is the owner and founder of Namo Narayana Ghee?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Namo Narayana Ghee was founded by popular creator and entrepreneur Elvish Yadav alongside dairy agriculture experts to bring back 100% authentic, unadulterated A2 Gir Cow Bilona ghee, ethically sourced from Gaushalas in Gujarat and Haryana."
          }
        },
        {
          "@type": "Question",
          name: "What is the price of Namo Narayana Ghee in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "On the official store (namonarayanaghee.store), the verified offer prices are: 500 ml at ₹599, 1 Litre flagship pack at ₹949, 2.5 Litres family pack at ₹2,099, and 5 Litres bulk pack at ₹3,499. All packs include free pan-India doorstep delivery."
          }
        },
        {
          "@type": "Question",
          name: "Is Namo Narayana Ghee made using the Bilona method?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Fresh whole A2 milk is converted into curd (Dahi) overnight, churned bi-directionally using a wooden Bilona to extract cultured Makkhan, and then slow-simmered on low flame into golden Danedar clarified butter fat."
          }
        },
        {
          "@type": "Question",
          name: "Is Namo Narayana Ghee pure and certified by FSSAI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Namo Narayana is FSSAI certified (Lic. No. 20824005000185) with independent accredited laboratory batch testing ensuring >99.5% milk fat, <0.5% moisture, 0% palm oil, and 0% synthetic colours or preservatives."
          }
        },
        {
          "@type": "Question",
          name: "How can I order Namo Narayana Ghee online?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can order genuine Namo Narayana Ghee directly through the official website at https://www.namonarayanaghee.store by choosing your pack size, clicking Add to Cart or Buy Now, and completing checkout via UPI, Cards, Netbanking, or COD."
          }
        },
        {
          "@type": "Question",
          name: "Can lactose-intolerant people consume Namo Narayana Bilona Ghee?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, because the milk is first cultured into curd and then slow-cooked to remove milk solids, genuine Bilona ghee is virtually 99.9% free from lactose and casein proteins, making it easy to digest."
          }
        },
        {
          "@type": "Question",
          name: "How long does delivery take across India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Orders are dispatched within 24 to 48 hours. Metro cities receive delivery within 2 to 4 business days, while other regional destinations take 3 to 6 business days with live tracking updates."
          }
        }
      ]
    };

    const productsSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Product",
            name: "Pure A2 Gir Cow Ghee (1 Litre)",
            image: absoluteUrl("/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"),
            description: "100% Pure A2 Gir Cow Ghee made via traditional cultured Bilona curd-churning method. Granular golden danedar texture with zero preservatives.",
            sku: "NMO-GHEE-1L",
            mpn: "NMO-GHEE-1L",
            brand: { "@type": "Brand", name: "Namo Narayana" },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "1688",
              bestRating: "5"
            },
            offers: {
              "@type": "Offer",
              url: absoluteUrl("/products/pure-desi-cow-ghee-1-litre"),
              priceCurrency: "INR",
              price: "949.00",
              priceValidUntil: "2027-12-31",
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              seller: { "@type": "Organization", name: "Namo Narayana" }
            }
          }
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Product",
            name: "Pure A2 Gir Cow Ghee (2.5 Litre)",
            image: absoluteUrl("/assets/product_6-2p5_jpg.webp"),
            description: "Family Value Pack: 2.5 Litres of pure A2 Gir Cow Bilona Ghee in heavy-duty airtight container. Lowest cost per litre.",
            sku: "NN-GHEE-2.5L",
            mpn: "NN-GHEE-2.5L",
            brand: { "@type": "Brand", name: "Namo Narayana" },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "842",
              bestRating: "5"
            },
            offers: {
              "@type": "Offer",
              url: absoluteUrl("/products/pure-desi-cow-ghee-2-5-litre"),
              priceCurrency: "INR",
              price: "2099.00",
              priceValidUntil: "2027-12-31",
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              seller: { "@type": "Organization", name: "Namo Narayana" }
            }
          }
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "Product",
            name: "Pure A2 Gir Cow Ghee (500 ml)",
            image: absoluteUrl("/assets/product_6_jpg_669162f4-5007-41a6-85ac-bbc8b7cdf942.webp"),
            description: "Starter and Trial Jar: 500 ml of pure A2 Gir Cow Bilona Ghee. Ideal for testing aroma and quality.",
            sku: "NMO-GHEE-500ML",
            mpn: "NMO-GHEE-500ML",
            brand: { "@type": "Brand", name: "Namo Narayana" },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "420",
              bestRating: "5"
            },
            offers: {
              "@type": "Offer",
              url: absoluteUrl("/products/pure-desi-cow-ghee-500-ml"),
              priceCurrency: "INR",
              price: "599.00",
              priceValidUntil: "2027-12-31",
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              seller: { "@type": "Organization", name: "Namo Narayana" }
            }
          }
        },
        {
          "@type": "ListItem",
          position: 4,
          item: {
            "@type": "Product",
            name: "Pure A2 Gir Cow Ghee (5 Litre)",
            image: absoluteUrl("/assets/product_6-5L_jpg.webp"),
            description: "Mega Value Bulk Saver: 5 Litres of pure A2 Gir Cow Bilona Ghee for joint families, ceremonies, and Ayurvedic use.",
            sku: "NN-GHEE-5L",
            mpn: "NN-GHEE-5L",
            brand: { "@type": "Brand", name: "Namo Narayana" },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "610",
              bestRating: "5"
            },
            offers: {
              "@type": "Offer",
              url: absoluteUrl("/products/pure-desi-cow-ghee-5-litre"),
              priceCurrency: "INR",
              price: "3499.00",
              priceValidUntil: "2027-12-31",
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              seller: { "@type": "Organization", name: "Namo Narayana" }
            }
          }
        }
      ]
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Verify Authentic A2 Desi Cow Bilona Ghee at Home",
      description: "A 5-step testing guide to verify the purity and authenticity of A2 Gir cow Bilona ghee in your kitchen.",
      step: [
        {
          "@type": "HowToStep",
          name: "Check Aroma",
          text: "Pure Bilona ghee has a caramelised, nutty cultured curd fragrance, unlike flat commercial cream ghee."
        },
        {
          "@type": "HowToStep",
          name: "Check Grain (Danedar Texture)",
          text: "At room temperature (20-28°C), genuine ghee naturally settles into microscopic golden granules."
        },
        {
          "@type": "HowToStep",
          name: "Palm Melting Test",
          text: "Place half a teaspoon on your palm. Pure cow ghee melts within 5 to 10 seconds at body temperature (~37°C)."
        },
        {
          "@type": "HowToStep",
          name: "Inspect Single-Ingredient Label",
          text: "Ensure the only declared ingredient is Clarified Milk Fat, with zero synthetic colors or preservatives."
        },
        {
          "@type": "HowToStep",
          name: "Verify FSSAI Lab Certification",
          text: "Verify batch laboratory test reports proving >99.5% milk fat and <0.5% moisture content."
        }
      ]
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
        <NamoNarayanaGheeReviewContent />
      </>
    );
  }

  // Standard blog post layout for other posts
  const articleSchema = generateArticleSchema(post);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <article className="nn-section bg-white">
        <div className="nn-container max-w-3xl mx-auto">
          <h1 className="nn-title mb-8">{post.title}</h1>
          <div className="prose prose-lg max-w-none text-nn-bark" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </>
  );
}
