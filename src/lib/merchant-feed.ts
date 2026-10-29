import { getAllProducts } from "./data";
import { siteConfig } from "./config";
import { absoluteUrl } from "./seo";

function getOptimizedShoppingTitle(title: string, packSize?: string): string {
  const size = packSize || (title.match(/\d+(\.\d+)?\s*(litre|l|ml)/i)?.[0] || "");
  if (size) {
    return `Buy Pure A2 Gir Cow Bilona Ghee ${size} Online in India | Namo Narayana`;
  }
  return `Buy Pure A2 Gir Cow Bilona Ghee Online in India | Namo Narayana`;
}

function cleanDescription(desc: string): string {
  return desc
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Generates a Google Merchant Center TSV feed.
 * Fully compliant with Google Shopping specifications:
 * id, title, description, link, image_link, additional_image_link, availability,
 * price, sale_price, google_product_category, product_type, brand, gtin, mpn,
 * identifier_exists, condition, shipping, shipping_weight, item_group_id, custom_label_0
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
    "availability",
    "price",
    "sale_price",
    "google_product_category",
    "product_type",
    "brand",
    "gtin",
    "mpn",
    "identifier_exists",
    "condition",
    "shipping",
    "shipping_weight",
    "item_group_id",
    "custom_label_0"
  ];

  const rows = [headers.join("\t")];

  for (const product of products) {
    const id = product.sku || `NMO-GHEE-${product.id}`;
    const title = getOptimizedShoppingTitle(product.title, product.packSize);
    const description = cleanDescription(product.description);
    const link = absoluteUrl(`/products/${product.slug}`);
    const imageLink = product.images[0] ? absoluteUrl(product.images[0]) : "";
    const additionalImageLink = product.images[1] ? absoluteUrl(product.images[1]) : "";
    const regularPrice = `${((product.compareAtPrice || product.price) / 100).toFixed(2)} INR`;
    const salePrice = `${(product.price / 100).toFixed(2)} INR`;
    const availability = product.available ? "in_stock" : "out_of_stock";
    const googleProductCategory = "422"; // Food > Cooking & Baking > Cooking Oils / Ghee
    const productType = "Food & Beverages > Dairy Products > Ghee > Pure A2 Desi Gir Cow Ghee";
    const brand = "Namo Narayana";
    const gtin = product.gtin || "";
    const mpn = product.mpn || product.sku || id;
    const identifierExists = gtin ? "yes" : "no";
    const condition = "new";
    const shipping = "IN:::0.00 INR";
    const shippingWeight = product.weightGrams ? `${product.weightGrams} g` : "1000 g";
    const itemGroupId = "namo-a2-gir-cow-ghee";
    const customLabel0 = "Bestseller";

    rows.push([
      id,
      title,
      description,
      link,
      imageLink,
      additionalImageLink,
      availability,
      regularPrice,
      salePrice,
      googleProductCategory,
      productType,
      brand,
      gtin,
      mpn,
      identifierExists,
      condition,
      shipping,
      shippingWeight,
      itemGroupId,
      customLabel0
    ].join("\t"));
  }

  return rows.join("\n");
}

/**
 * Generates an official Google Merchant Center XML RSS 2.0 Feed.
 * Supported natively by Google Merchant Center with full namespace validation.
 */
export function generateMerchantFeedXml(): string {
  const products = getAllProducts();

  const itemsXml = products.map((product) => {
    const id = product.sku || `NMO-GHEE-${product.id}`;
    const title = getOptimizedShoppingTitle(product.title, product.packSize);
    const description = cleanDescription(product.description);
    const link = absoluteUrl(`/products/${product.slug}`);
    const imageLink = product.images[0] ? absoluteUrl(product.images[0]) : "";
    const additionalImages = product.images.slice(1, 4).map(
      (img) => `      <g:additional_image_link>${absoluteUrl(img)}</g:additional_image_link>`
    ).join("\n");
    const regularPrice = `${((product.compareAtPrice || product.price) / 100).toFixed(2)} INR`;
    const salePrice = `${(product.price / 100).toFixed(2)} INR`;
    const availability = product.available ? "in_stock" : "out_of_stock";
    const weight = product.weightGrams ? `${product.weightGrams} g` : "1000 g";

    return `    <item>
      <g:id>${id}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageLink}</g:image_link>
${additionalImages}
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${regularPrice}</g:price>
      <g:sale_price>${salePrice}</g:sale_price>
      <g:brand>Namo Narayana</g:brand>
      <g:mpn>${product.mpn || id}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>422</g:google_product_category>
      <g:product_type><![CDATA[Food & Beverages > Dairy Products > Ghee > Pure A2 Desi Gir Cow Ghee]]></g:product_type>
      <g:item_group_id>namo-a2-gir-cow-ghee</g:item_group_id>
      <g:shipping_weight>${weight}</g:shipping_weight>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard Free Delivery</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
      <g:custom_label_0>Bestseller</g:custom_label_0>
      <g:custom_label_1>Pure Vedic Bilona Ghee</g:custom_label_1>
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${cleanDescription(siteConfig.description)}</description>
${itemsXml}
  </channel>
</rss>`;
}
