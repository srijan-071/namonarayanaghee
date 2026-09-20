import { getAllProducts } from "./data";
import { siteConfig } from "./config";
import { absoluteUrl } from "./seo";

/**
 * Generates a Google Merchant Center TSV feed.
 * Columns: id, title, description, link, image_link, additional_image_link, price, availability, condition, brand, gtin, mpn, google_product_category, product_type, shipping, canonical_link
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
    "availability",
    "condition",
    "brand",
    "gtin",
    "mpn",
    "google_product_category",
    "product_type",
    "shipping"
  ];

  const rows = [headers.join("\t")];

  for (const product of products) {
    // Generate a row for each variant or just the main product if no distinct variants
    // Usually, we want the variants to be submitted. 
    // Here we'll map the main product as a single item for simplicity, but if variants have distinct SKUs/Prices, we should map them.
    
    // For Namo Narayana, the variants might just be pack sizes. We'll output each variant.
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        const id = variant.sku || `${product.id}-${variant.id}`;
        const title = variant.title && variant.title.toLowerCase() !== 'default title' 
          ? `${product.title} - ${variant.title}` 
          : product.title;
        const description = product.description.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
        const link = absoluteUrl(`/products/${product.slug}`);
        const imageLink = product.images[0] ? absoluteUrl(product.images[0]) : "";
        const additionalImageLink = product.images[1] ? absoluteUrl(product.images[1]) : "";
        const price = `${variant.price.toFixed(2)} INR`;
        const availability = variant.available ? "in_stock" : "out_of_stock";
        const condition = "new";
        const brand = product.vendor;
        const gtin = variant.gtin || "";
        const mpn = variant.mpn || "";
        const googleProductCategory = "422"; // Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Cooking Oils
        const productType = product.type;
        const shipping = "IN:::0 INR"; // Example: Free shipping in India

        rows.push([
          id,
          title,
          description,
          link,
          imageLink,
          additionalImageLink,
          price,
          availability,
          condition,
          brand,
          gtin,
          mpn,
          googleProductCategory,
          productType,
          shipping
        ].join("\t"));
      }
    } else {
      // Fallback to main product if no variants
      const id = product.sku || product.id.toString();
      const title = product.title;
      const description = product.description.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
      const link = absoluteUrl(`/products/${product.slug}`);
      const imageLink = product.images[0] ? absoluteUrl(product.images[0]) : "";
      const additionalImageLink = product.images[1] ? absoluteUrl(product.images[1]) : "";
      const price = `${product.price.toFixed(2)} INR`;
      const availability = product.available ? "in_stock" : "out_of_stock";
      const condition = "new";
      const brand = product.vendor;
      const gtin = product.gtin || "";
      const mpn = product.mpn || "";
      const googleProductCategory = "422";
      const productType = product.type;
      const shipping = "IN:::0 INR";

      rows.push([
        id,
        title,
        description,
        link,
        imageLink,
        additionalImageLink,
        price,
        availability,
        condition,
        brand,
        gtin,
        mpn,
        googleProductCategory,
        productType,
        shipping
      ].join("\t"));
    }
  }

  return rows.join("\n");
}
