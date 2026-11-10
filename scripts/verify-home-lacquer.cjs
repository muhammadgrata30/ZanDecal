const { chromium } = require(process.env.HERO_PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

(async () => {
  await fs.mkdir('artifacts/home-lacquer', { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
  const results = [];
  try {
    for (const width of [1440, 390, 320]) {
      const context = await browser.newContext({ viewport: { width, height: width > 1000 ? 1000 : 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      await context.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 }); Object.defineProperty(navigator, 'deviceMemory', { get: () => 4 }); });
      const page = await context.newPage(); const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
      const hero = page.locator('#beranda.he-production');
      await hero.locator('.he-material-canvas[data-frames]').waitFor();
      assert.equal(await page.locator('main').count(), 1, 'A single main landmark');
      assert.equal(await page.locator('.racing-nav').count(), 1, 'One project navbar');
      assert.equal(await page.locator('.he-switcher').count(), 0, 'No mockup selector on homepage');
      assert.equal(await hero.locator('h1').getAttribute('aria-label'), 'CUT TO STAND OUT.');
      await page.getByRole('button', { name: 'Tema gelap', exact: true }).click();
      await page.waitForTimeout(150);
      assert.equal(await hero.evaluate(node => node.classList.contains('he-dark')), true);
      assert.equal(await page.evaluate(() => document.documentElement.classList.contains('dark')), true, 'Theme is global');
      await hero.screenshot({ path: `artifacts/home-lacquer/hero-${width}-dark.png` });
      await page.getByRole('button', { name: 'Tema terang', exact: true }).click();
      await page.waitForTimeout(150);
      assert.equal(await hero.evaluate(node => node.classList.contains('he-light')), true);
      await hero.screenshot({ path: `artifacts/home-lacquer/hero-${width}-light.png` });
      await page.getByRole('button', { name: 'Mode hemat', exact: true }).click();
      assert.equal(await hero.locator('canvas').count(), 0);
      await page.waitForFunction(() => { const image = document.querySelector('#beranda .he-object-static img'); return image?.complete && image.naturalWidth > 0; });
      await page.getByRole('button', { name: 'Aktifkan 3D', exact: true }).click();
      await hero.locator('.he-material-canvas[data-frames]').waitFor();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
      const navigation = ['material', '3d-studio', 'galeri', 'konsultasi'];
      for (const id of navigation) assert.equal(await page.locator(`[id="${id}"]`).count(), 1, `${id} section is reachable`);
      if (width < 1000) { await page.getByRole('button', { name: 'Buka menu', exact: true }).click(); await page.locator('.racing-links a[href="#material"]').click(); }
      else await page.locator('.racing-links a[href="#material"]').click();
      await page.waitForURL('**/#material'); await page.waitForTimeout(500);
      const materialTop = await page.locator('#material').evaluate(node => node.getBoundingClientRect().top);
      assert.ok(Math.abs(materialTop) < 160, 'Material navigation lands below the navbar');
      await page.locator('.racing-brand').click(); await page.waitForTimeout(500);
      assert.ok(await page.evaluate(() => window.scrollY < 5), 'Logo returns to hero');
      await hero.locator('.he-caption a').click(); await page.waitForURL('**/#konsultasi');
      await page.waitForTimeout(500);
      const consultationTop = await page.locator('#konsultasi').evaluate(node => node.getBoundingClientRect().top);
      assert.ok(Math.abs(consultationTop) < 180, 'Hero CTA lands on consultation');
      assert.equal(errors.length, 0, errors.join('\n'));
      results.push({ width, errors, materialTop, consultationTop }); console.log(JSON.stringify(results.at(-1)));
      await context.close();
    }
    // Exercise the actual animated production renderer without reduced motion.
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 }); });
    const page = await context.newPage(); await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    const canvas = page.locator('#beranda .he-material-canvas');
    await page.waitForFunction(() => +document.querySelector('#beranda .he-material-canvas')?.dataset.pressure > .5);
    const budget = await canvas.evaluate(node => ({ calls: +node.dataset.drawCalls, triangles: +node.dataset.triangles, fpsCap: +node.dataset.fpsCap }));
    assert.equal(budget.calls, 5); assert.equal(budget.triangles, 1956); assert.ok(budget.fpsCap <= 30);
    await page.getByRole('button', { name: 'Jeda animasi', exact: true }).click(); await page.waitForTimeout(300);
    const before = +(await canvas.getAttribute('data-frames')); await page.waitForTimeout(500);
    assert.equal(+(await canvas.getAttribute('data-frames')), before, 'Production pause stops rendering');
    results.push({ animated: true, ...budget, pausedFrameDelta: 0 });
    await context.close();
    await fs.writeFile('artifacts/home-lacquer/verification.json', JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
