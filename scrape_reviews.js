const puppeteer = require('puppeteer');
const fs = require('fs');

const urls = {
  "pure-a2-gir-cow-ghee-500-ml": "https://judge.me/reviews/stores/namonarayana.in/products/pure-a2-gir-cow-ghee-500-ml",
  "pure-desi-cow-ghee-1-litre": "https://judge.me/reviews/stores/namonarayana.in/products/pure-desi-cow-ghee-1-litre",
  "pure-desi-cow-ghee-2-5-litre": "https://judge.me/reviews/stores/namonarayana.in/products/pure-desi-cow-ghee-2-5-litre",
  "pure-desi-cow-ghee-5-litre": "https://judge.me/reviews/stores/namonarayana.in/products/pure-desi-cow-ghee-5-litre"
};

async function scrape() {
  const browser = await puppeteer.launch({ headless: "new" });
  const result = {};

  for (const [slug, url] of Object.entries(urls)) {
    console.log("Scraping " + slug);
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Wait for reviews to render
    try {
      await page.waitForSelector('.jdgm-rev', { timeout: 5000 });
    } catch(e) {
      console.log("No reviews found for " + slug);
      result[slug] = [];
      continue;
    }

    const reviews = await page.evaluate(() => {
      const reviewElements = document.querySelectorAll('.jdgm-rev');
      const data = [];
      reviewElements.forEach(el => {
        const author = el.querySelector('.jdgm-rev__author')?.innerText.trim() || 'Anonymous';
        const content = el.querySelector('.jdgm-rev__body')?.innerText.trim() || '';
        const ratingStr = el.dataset.score || el.querySelector('.jdgm-rev__rating')?.dataset.score || '5';
        const rating = parseInt(ratingStr, 10) || 5;
        const dateStr = el.querySelector('.jdgm-rev__timestamp')?.dataset.content || el.querySelector('.jdgm-rev__timestamp')?.innerText || new Date().toISOString();
        const verified = !!el.querySelector('.jdgm-rev__buyer-badge');
        
        data.push({
          id: Math.random().toString(36).substr(2, 9),
          author,
          initial: author[0] ? author[0].toUpperCase() : 'A',
          rating,
          date: dateStr.split(' ')[0] || "2026-09-30",
          content,
          verified
        });
      });
      return data;
    });

    result[slug] = reviews;
    await page.close();
  }

  await browser.close();
  fs.writeFileSync('reviews_scraped.json', JSON.stringify(result, null, 2));
  console.log("Done");
}

scrape().catch(console.error);
