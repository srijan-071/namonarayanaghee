import { siteConfig } from "./config";
import { Product, BlogPost } from "./types";
import { absoluteUrl } from "./seo";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/assets/logo.png"), // ensure we have a logo
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-89300-88005",
      contactType: "customer service",
      availableLanguage: ["en", "hi"],
    },
    sameAs: [
      "https://www.instagram.com/namonarayanaghee/",
      "https://www.facebook.com/namonarayanaghee/"
    ],
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
  };
}

export function generateProductSchema(product: Product) {
  const url = absoluteUrl(`/products/${product.slug}`);

  // Clean plain text description for Google Merchant & Shopping crawlers
  const plainDescription = product.description
    ? product.description.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim()
    : "100% Pure Desi Gir Cow Ghee made via traditional bilona method.";

  // Expiration 1 year ahead for priceValidUntil (Google Shopping requirement)
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const priceValidUntil = nextYear.toISOString().split("T")[0];

  const primarySku = product.sku || product.mpn || "NMO-GHEE";

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.title,
    description: plainDescription,
    image: product.images.map(img => absoluteUrl(img)),
    sku: primarySku,
    mpn: product.mpn || primarySku,
    brand: {
      "@type": "Brand",
      name: product.vendor || "Namo Narayana",
    },
    category: "Food & Beverages > Dairy Products > Ghee",
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: product.currency || "INR",
      price: (product.price / 100).toFixed(2),
      priceValidUntil: priceValidUntil,
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Namo Narayana",
      },
    },
  };

  if (product.shipping) {
    schema.offers.shippingDetails = {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: (product.shipping.cost / 100).toFixed(2),
        currency: "INR"
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "IN"
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 1,
          unitCode: "d"
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: product.shipping.daysMin,
          maxValue: product.shipping.daysMax,
          unitCode: "d"
        }
      }
    };
  }

  if (product.returns) {
    schema.offers.hasMerchantReturnPolicy = {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IN",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: product.returns.days,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn"
    };
  }

  if (product.gtin) {
    schema.gtin = product.gtin;
  }
  
  if (product.rating && product.reviews && product.reviews.length > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating.value.toString(),
      reviewCount: product.rating.count.toString(),
      bestRating: "5",
      worstRating: "1",
    };
    schema.review = product.reviews.slice(0, 10).map(r => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating.toString(),
        bestRating: "5",
        worstRating: "1",
      },
      author: {
        "@type": "Person",
        name: r.author,
      },
      datePublished: r.date,
      reviewBody: r.content,
    }));
  }

  return schema;
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function generateArticleSchema(article: BlogPost) {
  const url = absoluteUrl(`/blog/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.seo?.title || article.title,
    description: article.seo?.description || article.excerpt,
    image: article.image ? [absoluteUrl(article.image)] : [],
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
  };
}
