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

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.title,
    description: product.description,
    image: product.images.map(img => absoluteUrl(img)),
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.vendor,
    },
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: product.currency || "INR",
      price: product.price.toString(),
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
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
            minValue: 3,
            maxValue: 7,
            unitCode: "d"
          }
        }
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn"
      }
    },
  };

  if (product.gtin) {
    schema.gtin = product.gtin;
  }
  
  if (product.mpn) {
    schema.mpn = product.mpn;
  }

  if (product.rating && product.reviews) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating.value.toString(),
      reviewCount: product.rating.count.toString(),
    };
    schema.review = product.reviews.map(r => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating.toString(),
        bestRating: "5",
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
