const { chromium } = require(process.env.HERO_PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
  const results = [];
  try {
    for (const mobile of [false, true]) {
      const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
      await context.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 }); });
      const page = await context.newPage();
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://localhost:3000/hero-editions/2', { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelector('.he-material-canvas')?.dataset.pass === 'rest', undefined, { timeout: 45000 }).catch(async error => { console.log('initial scene', mobile, await page.evaluate(() => ({ hidden: document.hidden, canvas: document.querySelector('.he-material-canvas')?.outerHTML, fallback: !!document.querySelector('.he-object-static') })), errors); throw error; });
      await page.getByRole('button', { name: 'Jeda animasi', exact: true }).click();
      await page.waitForTimeout(200);
      await page.screenshot({ path: `artifacts/hero-editions/revision-2-${mobile ? 'mobile' : 'desktop'}-dark.png`, fullPage: true });
      await page.getByRole('button', { name: 'Tema terang', exact: true }).click();
      await page.waitForTimeout(600);
      const light = await page.locator('.he-lacquer-photo').evaluate(node => ({ opacity: +getComputedStyle(node).opacity, mixBlendMode: getComputedStyle(node).mixBlendMode }));
      assert.ok(light.opacity >= .28, 'Light background remains visible');
      await page.screenshot({ path: `artifacts/hero-editions/revision-2-${mobile ? 'mobile' : 'desktop'}-light.png`, fullPage: true });
      const canvas = page.locator('.he-material-canvas');
      const before = +(await canvas.getAttribute('data-frames')); await page.waitForTimeout(350);
      assert.equal(+(await canvas.getAttribute('data-frames')), before, 'Pause stops GPU drawing');
      await page.getByRole('button', { name: 'Lanjutkan animasi', exact: true }).click();
      if (mobile) await page.evaluate(() => document.querySelector('.he-motion-controls button[aria-label="Ulangi animasi"]').click());
      else await page.getByRole('button', { name: 'Ulangi animasi', exact: true }).click();
      await page.waitForFunction(() => +document.querySelector('.he-material-canvas')?.dataset.pressure > .65);
      const pressure = +(await canvas.getAttribute('data-pressure'));
      await page.screenshot({ path: `artifacts/hero-editions/revision-2-${mobile ? 'mobile' : 'desktop'}-applying.png`, fullPage: true });
      await page.waitForFunction(() => document.querySelector('.he-material-canvas')?.dataset.pass === 'rest');
      assert.equal(+(await canvas.getAttribute('data-pressure')), 0, 'Curl settles without a continuous loop');
      const counts = await canvas.evaluate(node => ({ calls: +node.dataset.drawCalls, triangles: +node.dataset.triangles, cap: +node.dataset.fpsCap }));
      assert.equal(counts.calls, 5); assert.equal(counts.triangles, 1956); assert.ok(counts.cap <= 30);
      const a = await page.locator('.he-light-blade-one').evaluate(node => getComputedStyle(node).transform); await page.waitForTimeout(600);
      const b = await page.locator('.he-light-blade-one').evaluate(node => getComputedStyle(node).transform);
      assert.notEqual(a, b, 'Light theme background animation progresses');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.equal(errors.length, 0, errors.join('\n'));
      results.push({ mobile, light, pressure, ...counts, errors });
      await context.close();
    }
    await fs.writeFile('artifacts/hero-editions/revision-2.json', JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
