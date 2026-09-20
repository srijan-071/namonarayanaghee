import * as cheerio from "cheerio";

const BASE_URL = process.argv[2] || "http://localhost:3000";

const PAGES_TO_TEST = [
  "/",
  "/collections/ghee",
  "/products/pure-desi-cow-ghee-1-litre",
  "/a2-ghee-guide",
  "/bilona-ghee",
  "/gir-cow-ghee",
  "/our-story"
];

async function runAudit() {
  console.log(`\n🔍 Starting SEO & Consistency Audit for ${BASE_URL}\n`);
  let hasErrors = false;

  // 1. Fetch Merchant Feed to use as Ground Truth for products
  let merchantData: Record<string, any> = {};
  try {
    const res = await fetch(`${BASE_URL}/merchant-feed.tsv`);
    if (!res.ok) throw new Error("Failed to fetch merchant feed");
    const tsv = await res.text();
    const rows = tsv.trim().split("\n");
    const headers = rows[0].split("\t");
    
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split("\t");
      const item: any = {};
      headers.forEach((h, idx) => { item[h] = values[idx]; });
      // Use link to match
      merchantData[item.link] = item;
    }
    console.log("✅ Merchant Feed TSV parsed successfully.");
  } catch (err) {
    console.error("❌ Merchant Feed Test Failed:", err);
    hasErrors = true;
  }

  // 2. Audit each page
  for (const path of PAGES_TO_TEST) {
    const url = `${BASE_URL}${path}`;
    console.log(`\n➡️ Auditing: ${url}`);
    
    try {
      const res = await fetch(url);
      if (res.status !== 200) {
        console.error(`❌ HTTP Status: ${res.status}`);
        hasErrors = true;
        continue;
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      // Basic HTML SEO checks
      const title = $("title").text();
      const description = $("meta[name='description']").attr("content");
      const canonical = $("link[rel='canonical']").attr("href");
      const h1 = $("h1").text().trim();
      const ogTitle = $("meta[property='og:title']").attr("content");
      
      if (!title) { console.error("❌ Missing <title>"); hasErrors = true; }
      if (!description) { console.error("❌ Missing meta description"); hasErrors = true; }
      if (!canonical) { console.error("❌ Missing canonical link"); hasErrors = true; }
      if (!h1) { console.error("❌ Missing <h1> tag"); hasErrors = true; }
      if (!ogTitle) { console.error("❌ Missing og:title"); hasErrors = true; }
      
      if (title && description && canonical && h1) {
        console.log(`  ✅ Basic SEO tags present (Title: ${title})`);
      }

      // JSON-LD checks
      const jsonLdScripts = $("script[type='application/ld+json']");
      if (jsonLdScripts.length === 0) {
        console.error("❌ Missing JSON-LD structured data");
        hasErrors = true;
      } else {
        const schemas: any[] = [];
        jsonLdScripts.each((_, el) => {
          try {
            schemas.push(JSON.parse($(el).html() || "{}"));
          } catch (e) {
            console.error("❌ Invalid JSON in LD+JSON tag");
            hasErrors = true;
          }
        });

        console.log(`  ✅ Found ${schemas.length} JSON-LD blocks`);

        // If it's a product page, do consistency checks
        if (path.includes("/products/")) {
          const productSchema = schemas.find(s => s["@type"] === "Product");
          if (!productSchema) {
            console.error("❌ Missing Product JSON-LD on product page");
            hasErrors = true;
          } else {
            const schemaPrice = productSchema.offers?.price;
            const schemaCurrency = productSchema.offers?.priceCurrency;
            const schemaAvailability = productSchema.offers?.availability;
            const schemaName = productSchema.name;
            
            // Check UI consistency
            // Note: UI checking is hard without specific CSS selectors.
            // We'll rely on text content matching.
            if (!html.includes(schemaName)) {
               console.error(`❌ Data Mismatch: Schema name "${schemaName}" not found in UI HTML.`);
               hasErrors = true;
            }
            if (schemaPrice && !html.includes(schemaPrice)) {
               console.error(`❌ Data Mismatch: Schema price "${schemaPrice}" not found in UI HTML.`);
               hasErrors = true;
            }

            // Check Merchant Feed consistency
            // The url in merchant feed should be the canonical remote URL, so we construct it
            // assuming siteConfig.url is used in TSV. 
            // We'll just find the TSV row by searching if TSV link ends with the path
            const tsvItem = Object.values(merchantData).find((m: any) => m.link && m.link.endsWith(path));
            if (!tsvItem) {
               console.error(`❌ Data Mismatch: Product not found in Merchant TSV Feed`);
               hasErrors = true;
            } else {
               const tsvPriceStr = tsvItem.price; // "2350.00 INR"
               if (!tsvPriceStr.includes(schemaPrice)) {
                 console.error(`❌ Data Mismatch: TSV Price (${tsvPriceStr}) vs Schema Price (${schemaPrice})`);
                 hasErrors = true;
               }
               const tsvAvail = tsvItem.availability;
               const isSchemaInStock = schemaAvailability?.includes("InStock");
               if ((tsvAvail === "in_stock" && !isSchemaInStock) || (tsvAvail === "out_of_stock" && isSchemaInStock)) {
                 console.error(`❌ Data Mismatch: TSV Availability (${tsvAvail}) vs Schema Availability`);
                 hasErrors = true;
               }
               
               console.log("  ✅ Product Data Consistency verified (Schema vs TSV vs UI text)");
            }
          }
        }
      }

    } catch (err) {
      console.error(`❌ Error auditing ${url}:`, err);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error("\n❌ SEO Audit Failed! Please fix the errors above.");
    process.exit(1);
  } else {
    console.log("\n🚀 All SEO & Consistency checks passed!");
    process.exit(0);
  }
}

runAudit();
