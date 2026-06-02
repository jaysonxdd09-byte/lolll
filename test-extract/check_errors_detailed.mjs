import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });
  
  try {
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle0', timeout: 10000 });
    // Let's wait a bit and evaluate the DOM to see what's rendered
    const html = await page.evaluate(() => document.body.innerHTML);
    if (html.includes('animate-spin')) {
        console.log('Spinner found in DOM');
    }
  } catch (e) {
    console.log('Timeout or error:', e.message);
  }
  
  await browser.close();
})();

