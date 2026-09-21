import { load } from 'cheerio';
import { RAW_PRODUCTS } from '../src/lib/data-store';

const BASE_URL = process.argv[2] || 'http://localhost:3000';

async function audit() {
  console.log(`Starting SEO Audit on ${BASE_URL}...`);
  let hasErrors = false;

  // 1. Fetch Merchant Feed and parse it
  console.log('\n[1] Auditing Merchant Center Feed...');
  const feedUrl = `${BASE_URL}/merchant-feed.tsv`;
  const feedRes = await fetch(feedUrl);
  if (!feedRes.ok) {
    console.error(`❌ Failed to fetch feed at ${feedUrl}`);
    hasErrors = true;
    return;
  }
  const feedText = await feedRes.text();
  const feedLines = feedText.split('\n');
  const headers = feedLines[0].split('\t');
  
  const feedProducts: any = {};
  for (let i = 1; i < feedLines.length; i++) {
    const cols = feedLines[i].split('\t');
    if (cols.length < headers.length) continue;
    const item: any = {};
    headers.forEach((h, idx) => {
      item[h] = cols[idx];
    });
    // Extract ID (either SKU or product ID). We'll map by URL handle to simplify matching.
    const urlMatch = item.link.match(/\/products\/(.+)$/);
    if (urlMatch) {
      feedProducts[urlMatch[1]] = item;
    }
  }
  console.log(`✅ Loaded ${Object.keys(feedProducts).length} items from Merchant Feed.`);

  // 2. Audit each product page
  console.log('\n[2] Auditing Product Pages for Data Consistency...');
  const productSlugs = Object.keys(RAW_PRODUCTS);
  
  for (const slug of productSlugs) {
    const raw = RAW_PRODUCTS[slug];
    const url = `${BASE_URL}/products/${slug}`;
    console.log(`\nChecking ${url}...`);
    
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`❌ Failed to fetch page for ${slug}. Status: ${res.status}`);
        hasErrors = true;
        continue;
      }
      const html = await res.text();
      const $ = load(html);

      // Check Canonical
      const canonical = $('link[rel="canonical"]').attr('href');
      if (!canonical || !canonical.endsWith(`/products/${slug}`)) {
        console.error(`❌ Missing or incorrect canonical tag for ${slug}: ${canonical}`);
        hasErrors = true;
      } else {
        console.log(`  ✅ Canonical tag correct.`);
      }

      // Check JSON-LD
      const jsonLdScripts = $('script[type="application/ld+json"]');
      let foundProductSchema = false;
      let schemaData: any = null;
      
      jsonLdScripts.each((_, el) => {
        try {
          const json = JSON.parse($(el).html() || '{}');
          if (json['@type'] === 'Product') {
            foundProductSchema = true;
            schemaData = json;
          }
        } catch (e) {
          // ignore
        }
      });

      if (!foundProductSchema) {
        console.error(`❌ No Product JSON-LD found for ${slug}`);
        hasErrors = true;
        continue;
      } else {
        console.log(`  ✅ Product JSON-LD found.`);
      }

      // Validate JSON-LD Price matches Raw Data
      // Raw data is in paise. JSON-LD should be in rupees.
      // We assume price is same for all variants for simplicity in this basic check.
      let expectedPrice = (raw.price / 100).toFixed(2);
      if (raw.variants && raw.variants.length > 0) {
        expectedPrice = (raw.variants[0].price / 100).toFixed(2);
      }
      
      if (schemaData.offers?.price !== expectedPrice) {
        console.error(`❌ Price Mismatch! JSON-LD: ${schemaData.offers?.price}, Expected: ${expectedPrice}`);
        hasErrors = true;
      } else {
        console.log(`  ✅ JSON-LD Price matches source of truth (${expectedPrice}).`);
      }

      // Validate Merchant Feed matches Raw Data
      const feedItem = feedProducts[slug];
      if (!feedItem) {
        console.warn(`⚠️ Warning: ${slug} not found in merchant feed by URL matcher.`);
      } else {
        const expectedFeedPrice = `${expectedPrice} INR`;
        if (feedItem.price !== expectedFeedPrice && feedItem.sale_price !== expectedFeedPrice) {
           console.error(`❌ Merchant Feed Price Mismatch for ${slug}! Feed: ${feedItem.price}/${feedItem.sale_price}, Expected: ${expectedFeedPrice}`);
           hasErrors = true;
        } else {
           console.log(`  ✅ Merchant Feed Price matches source of truth (${expectedFeedPrice}).`);
        }
      }

    } catch (e: any) {
      console.error(`❌ Error checking ${slug}:`, e.message);
      hasErrors = true;
    }
  }

  // 3. Audit Elvish Yadav Page
  console.log('\n[3] Auditing Elvish Yadav association page...');
  const elvishUrl = `${BASE_URL}/elvish-yadav-ghee`;
  try {
    const res = await fetch(elvishUrl);
    if (!res.ok) {
      console.error(`❌ Elvish Yadav page missing. Status: ${res.status}`);
      hasErrors = true;
    } else {
      const html = await res.text();
      const $ = load(html);
      
      // Check JSON-LD FAQ
      const jsonLdScripts = $('script[type="application/ld+json"]');
      let foundFAQ = false;
      jsonLdScripts.each((_, el) => {
        try {
          const json = JSON.parse($(el).html() || '{}');
          if (json['@type'] === 'FAQPage') {
            foundFAQ = true;
          }
        } catch (e) {}
      });
      if (!foundFAQ) {
        console.error(`❌ Elvish Yadav page missing FAQPage schema.`);
        hasErrors = true;
      } else {
        console.log(`  ✅ FAQPage schema found.`);
      }
    }
  } catch (e: any) {
    console.error(`❌ Error checking Elvish Yadav page:`, e.message);
    hasErrors = true;
  }

  if (hasErrors) {
    console.error('\n❌ SEO Audit Failed! Data inconsistencies found.');
    process.exit(1);
  } else {
    console.log('\n✅ All checks passed! The source of truth remains intact across HTML, JSON-LD, and Merchant Feeds.');
  }
}

audit();
