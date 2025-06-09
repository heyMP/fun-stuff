import playwright from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const browser = await playwright['chromium'].launch({
  headless: false,
  devtools: false,
});

const context = await browser.newContext({
  bypassCSP: true,
  ignoreHTTPSErrors: true,
});

await context.route('**', async route => {
  if (route.request().resourceType() === 'document') {
    const response = await route.fetch();
    const doc = await fs.readFile(path.join(process.cwd(), 'tests/pages/index.html'), 'utf8');
    if (doc) {
      await route.fulfill({
        response,
        body: doc
      });
      return;
    }
  }
  await route.fallback();
});

await context.route('**/mockServiceWorker.js', async route => {
  const file = await fs.readFile(path.join(process.cwd(), 'dist/mockServiceWorker.js'), 'utf8');
  if (!file) {
    await route.fallback();
    return;
  }
  await route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: file
  });
});
const page = await context.newPage();

page.goto('https://www.google.com');
