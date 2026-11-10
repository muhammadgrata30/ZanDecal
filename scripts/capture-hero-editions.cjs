const { chromium } = require(process.env.HERO_PLAYWRIGHT_PATH || 'playwright');
const sharp = require('sharp');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    await context.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 }); Object.defineProperty(navigator, 'deviceMemory', { get: () => 4 }); });
    const page = await context.newPage();
    const ids = (process.env.HERO_CAPTURE_IDS || '1,2,3,4,5').split(',').map(Number);
    for (const id of ids) {
      await page.goto(`http://localhost:3000/hero-editions/${id}`, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelector('.he-material-canvas')?.dataset.pass === 'rest');
      await page.getByRole('button', { name: 'Jeda animasi', exact: true }).click();
      await page.waitForTimeout(200);
      const full = await page.screenshot({ path: `artifacts/hero-editions/desktop-${id}.png`, fullPage: true });
      await sharp(full).resize({ width: 1152 }).webp({ quality: 83 }).toFile(`public/design-preview/hero-editions/preview-${id}.webp`);
      const isolate = await page.addStyleTag({ content: 'html,body,.he-preview{background:transparent!important}.he-preview>*:not(.he-object){visibility:hidden!important}' });
      const buffer = await page.locator('.he-object').screenshot({ omitBackground: true });
      const poster = `public/design-preview/hero-editions/poster-${id}.webp`;
      await sharp(buffer).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 84 }).toFile(poster);
      await isolate.evaluate(node => node.remove());
      assert.equal((await sharp(poster).metadata()).hasAlpha, true, 'Static posters preserve transparency');
      console.log('captured', id, (await fs.stat(poster)).size);
    }
    await page.goto('http://localhost:3000/hero-editions', { waitUntil: 'networkidle' });
    await page.locator('.he-gallery-image img').evaluateAll(async nodes => { await Promise.all(nodes.map(node => node.decode())); });
    await page.screenshot({ path: 'artifacts/hero-editions/gallery-desktop.png', fullPage: true });
    assert.equal(await page.locator('.he-gallery-grid article').count(), 5);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: 'artifacts/hero-editions/gallery-mobile.png', fullPage: true });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await context.close();
    const saveData = await browser.newContext({ viewport: { width: 360, height: 800 } });
    await saveData.addInitScript(() => { Object.defineProperty(navigator, 'connection', { value: { saveData: true, addEventListener() {}, removeEventListener() {} }, configurable: true }); });
    const savingPage = await saveData.newPage();
    await savingPage.goto('http://localhost:3000/hero-editions/1', { waitUntil: 'networkidle' });
    await savingPage.locator('.he-object-static').waitFor();
    assert.equal(await savingPage.locator('canvas.he-material-canvas').count(), 0, 'Data Saver defaults to static');
    await saveData.close();
    console.log('PASS: transparent posters, gallery, Data Saver');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
