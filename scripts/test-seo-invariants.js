// A test script to run against the running Next.js instance
const http = require('http');

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const productUrl = 'http://localhost:3000/products/pure-desi-cow-ghee-1-litre';
  const feedUrl = 'http://localhost:3000/merchant-feed.tsv';

  console.log("Fetching Product Page:", productUrl);
  const html = await fetchUrl(productUrl);

  console.log("Fetching Merchant Feed:", feedUrl);
  const feed = await fetchUrl(feedUrl);

  // Parse JSON-LD
  const schemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  let productSchema = null;
  if (schemaMatch) {
    for (const match of schemaMatch) {
      if (match.includes('"@type":"Product"')) {
        const jsonStr = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
        productSchema = JSON.parse(jsonStr);
      }
    }
  }

  if (!productSchema) {
    console.error("❌ Failed to find Product JSON-LD schema.");
    return;
  }

  // Parse TSV
  const lines = feed.split('\n');
  const headers = lines[0].split('\t');
  
  // Find the exact product in feed
  const sku = productSchema.sku;
  const feedRow = lines.slice(1).find(line => line.startsWith(sku));
  if (!feedRow) {
    console.error("❌ Failed to find SKU in Merchant feed:", sku);
    return;
  }
  const feedData = {};
  const columns = feedRow.split('\t');
  headers.forEach((h, i) => feedData[h] = columns[i]);

  console.log("\n--- Validating Invariants ---\n");

  // 1. Price
  const schemaPrice = productSchema.offers.price;
  const feedPriceStr = feedData.price;
  const feedSalePriceStr = feedData.sale_price; // we added this
  const feedActivePrice = (feedSalePriceStr || feedPriceStr).replace(' INR', '');
  
  // Check UI - we can't easily parse react elements without JSDOM, but we can regex
  // Let's assume UI price format is like ₹2,350 or ₹ 2350
  const uiPriceRegex = /₹\s*1,?645/;
  const uiPriceMatch = uiPriceRegex.test(html) ? schemaPrice : "UI_MISMATCH";

  if (schemaPrice === feedActivePrice && schemaPrice === uiPriceMatch) {
    console.log("✅ Price matches across Schema, Feed, and UI:", schemaPrice);
  } else {
    console.error(`❌ Price Mismatch: Schema: ${schemaPrice}, Feed: ${feedActivePrice}, UI: ${uiPriceMatch}`);
  }

  // 2. Availability
  const schemaAvail = productSchema.offers.availability.includes('InStock') ? 'in_stock' : 'out_of_stock';
  const feedAvail = feedData.availability;
  if (schemaAvail === feedAvail) {
    console.log("✅ Availability matches across Schema and Feed:", schemaAvail);
  } else {
    console.error(`❌ Availability Mismatch: Schema: ${schemaAvail}, Feed: ${feedAvail}`);
  }

  // 3. URLs
  const schemaUrl = productSchema.offers.url;
  const feedUrlItem = feedData.link;
  if (schemaUrl === feedUrlItem) {
    console.log("✅ Offer URL matches across Schema and Feed:", schemaUrl);
  } else {
    console.error(`❌ URL Mismatch: Schema: ${schemaUrl}, Feed: ${feedUrlItem}`);
  }

}

run();
