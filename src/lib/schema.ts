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
      price: (product.price / 100).toFixed(2),
      priceValidUntil: "2027-12-31",
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Namo Narayana",
        url: siteConfig.url,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: product.shipping ? (product.shipping.cost / 100).toFixed(2) : "0.00",
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
            minValue: product.shipping?.daysMin || 2,
            maxValue: product.shipping?.daysMax || 5,
            unitCode: "d"
          }
        }
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: product.returns?.days || 30,
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
