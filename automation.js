const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const headed = process.argv.includes('--headed');
  const browser = await chromium.launch({
    headless: !headed,
    slowMo: headed ? 400 : 0,
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://test.netlify.app/');

    await page.getByLabel('Name *').fill('Jane Doe');
    await page.getByLabel('Email *').fill('jane.doe@example.com');
    await page.getByLabel('Phone *').fill('5550100123');
    await page.getByLabel('Company').fill('Acme');
    await page.getByLabel('Website').fill('https://example.com');

    // Select before the screenshot so the image shows 51-500.
    await page.getByLabel('Number of Employees').selectOption('51-500');

    fs.mkdirSync('screenshots', { recursive: true });
    await page.screenshot({
      path: 'screenshots/before-request-callback.png',
      fullPage: true,
    });

    await page.getByRole('button', { name: 'Request a call back' }).click();
    await page.waitForURL(/thank-you\.html/);
    await page.getByRole('heading', { name: 'Thank You!' }).waitFor();

    console.log('Reached the thank you page:', page.url());
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
