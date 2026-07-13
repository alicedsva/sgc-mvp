import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5173/testes/carreira', { waitUntil: 'networkidle' });
await page.waitForSelector('text=Minha Carreira', { timeout: 15000 });
const count = await page.locator('.scrollbar-thin').count();
console.log('scrollbar-thin elements found:', count);
await browser.close();
