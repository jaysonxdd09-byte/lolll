import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0', timeout: 15000 });
    await page.screenshot({ path: 'screenshot.png' });
    console.log('Screenshot saved to screenshot.png');
    
    // Evaluate if loading spinner is present
    const isSpinner = await page.evaluate(() => {
      return document.querySelector('.animate-spin') !== null;
    });
    console.log('Is spinner present?', isSpinner);
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('BODY TEXT PREVIEW:', bodyText.substring(0, 200));
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();

