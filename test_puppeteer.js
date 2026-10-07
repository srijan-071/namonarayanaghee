const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  
  // Intercept requests
  page.on('request', request => {
    if (request.url().includes('judge.me')) {
      console.log('REQUEST:', request.url());
    }
  });
  
  await page.goto('https://namonarayana.com/products/pure-desi-cow-ghee-1-litre', {waitUntil: 'networkidle2'});
  
  // Try to click page 2 of reviews
  try {
    await page.evaluate(() => {
      document.querySelector('.jdgm-paginate__page[data-page="2"]').click();
    });
    await new Promise(r => setTimeout(r, 2000));
  } catch (e) {
    console.log("Could not click next page");
  }

  await browser.close();
})();
