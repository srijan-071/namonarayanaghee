import { getAllProducts } from "./data";
import { siteConfig } from "./config";
import { absoluteUrl } from "./seo";

/**
 * Generates an official, highly optimized Google Merchant Center TSV feed.
 * Implements Google's exact Product Data Specification:
 * - Direct pricing with compare-at MRP and sale_price
 * - identifier_exists: no (prevents GTIN/barcode rejection for D2C brands)
 * - Free PAN-India delivery shipping tags (IN:::0.00 INR)
 * - Cleaned non-duplicate titles and high-intent keyword targeting
 */
export function generateMerchantFeedTsv(): string {
  const products = getAllProducts();
  
  const headers = [
    "id",
    "title",
    "description",
    "link",
    "image_link",
    "additional_image_link",
    "price",
    "sale_price",
    "availability",
    "condition",
    "brand",
    "identifier_exists",
    "google_product_category",
    "product_type",
    "shipping",
    "shipping_weight"
  ];

  const rows = [headers.join("\t")];

  const weightMap: Record<string, string> = {
    "pure-desi-cow-ghee-500-ml": "500 g",
    "pure-a2-gir-cow-ghee-500-ml": "500 g",
    "pure-desi-cow-ghee-1-litre": "1000 g",
    "pure-desi-cow-ghee-2-5-litre": "2500 g",
    "pure-desi-cow-ghee-5-litre": "5000 g",
  };

  for (const product of products) {
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        const id = variant.sku || `${product.id}-${variant.id}`;
        
        // Build clean, high-CTR Shopping title without redundant repetition
        const rawTitle = product.title;
        const variantTitle = variant.title && variant.title.toLowerCase() !== "default title" ? variant.title : "";
        let cleanTitle = rawTitle;
        if (variantTitle && !rawTitle.toLowerCase().includes(variantTitle.toLowerCase())) {
          cleanTitle = `${rawTitle} - ${variantTitle}`;
        }
        const title = `Buy ${cleanTitle} Online | Namo Narayana`;

        const description = (product.description || "")
          .replace(/<[^>]*>?/gm, " ")
          .replace(/&amp;/g, "&")
          .replace(/&nbsp;/g, " ")
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/\s+/g, " ")
          .trim();

        const link = absoluteUrl(`/products/${product.slug}`);
        const imageLink = product.images[0] ? absoluteUrl(product.images[0]) : "";
        const additionalImageLink = product.images[1] ? absoluteUrl(product.images[1]) : "";
        
        const price = `${((variant.compareAtPrice || variant.price) / 100).toFixed(2)} INR`;
        const salePrice = `${(variant.price / 100).toFixed(2)} INR`;
        const availability = variant.available ? "in_stock" : "out_of_stock";
        const condition = "new";
        const brand = product.vendor || "Namo Narayana";
        const identifierExists = "no";
        const googleProductCategory = "422"; // Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils
        const productType = "Food & Beverages > Dairy Products > Ghee > A2 Gir Cow Bilona Ghee";
        const shipping = "IN:::0.00 INR";
        const shippingWeight = weightMap[product.slug] || "1000 g";

        rows.push([
          id,
          title,
          description,
          link,
          imageLink,
          additionalImageLink,
          price,
          salePrice,
          availability,
          condition,
          brand,
          identifierExists,
          googleProductCategory,
          productType,
          shipping,
          shippingWeight
        ].join("\t"));
      }
    } else {
      const id = product.sku || product.id.toString();
      const title = `Buy ${product.title} Online | Namo Narayana`;
      const description = (product.description || "")
        .replace(/<[^>]*>?/gm, " ")
        .replace(/&amp;/g, "&")
        .replace(/&nbsp;/g, " ")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();

      const link = absoluteUrl(`/products/${product.slug}`);
      const imageLink = product.images[0] ? absoluteUrl(product.images[0]) : "";
      const additionalImageLink = product.images[1] ? absoluteUrl(product.images[1]) : "";
      const price = `${((product.compareAtPrice || product.price) / 100).toFixed(2)} INR`;
      const salePrice = `${(product.price / 100).toFixed(2)} INR`;
      const availability = product.available ? "in_stock" : "out_of_stock";
      const condition = "new";
      const brand = product.vendor || "Namo Narayana";
      const identifierExists = "no";
      const googleProductCategory = "422";
      const productType = "Food & Beverages > Dairy Products > Ghee > A2 Gir Cow Bilona Ghee";
      const shipping = "IN:::0.00 INR";
      const shippingWeight = weightMap[product.slug] || "1000 g";

      rows.push([
        id,
        title,
        description,
        link,
        imageLink,
        additionalImageLink,
        price,
        salePrice,
        availability,
        condition,
        brand,
        identifierExists,
        googleProductCategory,
        productType,
        shipping,
        shippingWeight
      ].join("\t"));
    }
  }

  return rows.join("\n");
}
