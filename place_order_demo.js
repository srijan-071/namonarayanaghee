const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser to place an order...");
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to product page...");
    await page.goto('http://localhost:3000/products/pure-desi-cow-ghee-1-litre', {waitUntil: 'networkidle2'});
    
    // Wait for the Buy Now button
    console.log("Clicking Buy Now...");
    await page.waitForSelector('button', { visible: true });
    
    // Evaluate to click the Buy Now button (which contains "Buy Now")
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const buyNowBtn = buttons.find(b => b.textContent.includes('Buy Now'));
      if (buyNowBtn) {
        buyNowBtn.click();
      } else {
        throw new Error("Buy Now button not found");
      }
    });

    console.log("Waiting for checkout page...");
    // Wait to land on checkout page
    await page.waitForNavigation({waitUntil: 'networkidle0'});
    
    console.log("Filling contact info...");
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'test@example.com', {delay: 50});
    
    // Wait for phone input
    const inputs = await page.$$('input');
    // Assuming the second input is phone, but we should find it by type="tel" or placeholder
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const phoneInput = inputs.find(i => i.placeholder.toLowerCase().includes('phone') || i.type === 'tel');
      if (phoneInput) phoneInput.value = '9999999999';
      
      // dispatch event so react picks it up
      if (phoneInput) {
        phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
        phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await page.waitForTimeout(1000);

    console.log("Clicking Continue to Shipping...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const continueBtn = buttons.find(b => b.textContent.includes('Continue to Shipping'));
      if (continueBtn) continueBtn.click();
    });

    await page.waitForTimeout(2000);

    console.log("Filling shipping info...");
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      
      const nameInput = inputs.find(i => i.placeholder.includes('Name'));
      if (nameInput) { nameInput.value = 'Test User'; nameInput.dispatchEvent(new Event('input', {bubbles: true})); }
      
      const addressInput = inputs.find(i => i.placeholder.includes('Address'));
      if (addressInput) { addressInput.value = '123 Test St'; addressInput.dispatchEvent(new Event('input', {bubbles: true})); }
      
      const cityInput = inputs.find(i => i.placeholder.includes('City'));
      if (cityInput) { cityInput.value = 'Test City'; cityInput.dispatchEvent(new Event('input', {bubbles: true})); }
      
      const pinInput = inputs.find(i => i.placeholder.includes('PIN'));
      if (pinInput) { pinInput.value = '110001'; pinInput.dispatchEvent(new Event('input', {bubbles: true})); }
    });
    
    // Wait for state select
    await page.evaluate(() => {
      const select = document.querySelector('select');
      if (select) {
        select.value = 'Delhi';
        select.dispatchEvent(new Event('change', {bubbles: true}));
      }
    });

    await page.waitForTimeout(1000);

    console.log("Clicking Continue to Payment...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const continueBtn = buttons.find(b => b.textContent.includes('Continue to Payment'));
      if (continueBtn) continueBtn.click();
    });

    await page.waitForTimeout(2000);

    console.log("Clicking Place Order...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const placeOrderBtn = buttons.find(b => b.textContent.includes('Place Order') || b.textContent.includes('Pay Now'));
      if (placeOrderBtn) placeOrderBtn.click();
    });

    console.log("Wait for redirect...");
    await page.waitForTimeout(5000);
    
    console.log("Current URL:", page.url());
    if (page.url().includes('potter-world.com') || page.url().includes('razorpay') || page.url().includes('pay-proxy')) {
      console.log("✅ SUCCESSFULLY REACHED PAYMENT PAGE!");
    } else {
      console.log("❌ DID NOT REACH PAYMENT PAGE.");
    }
    
    // Keep browser open for a moment so user can see it
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error("Error during automation:", error);
  } finally {
    console.log("Closing browser...");
    await browser.close();
  }
})();
