const { chromium } = require(process.env.HERO_PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
  const results = [];
  try {
    for (const width of [1440, 390, 320]) {
      const context = await browser.newContext({ viewport: { width, height: width > 1000 ? 1000 : 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      const page = await context.newPage(); const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://localhost:3000/hero-editions/2', { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.racing-nav').count(), 1);
      assert.equal(await page.locator('.he-nav').count(), 0);
      const labels = await page.locator('.racing-label').allTextContents();
      assert.deepEqual(labels, ['Material', '3D Studio', 'Custom Sticker', 'Galeri', 'Cara Order']);
      assert.equal(await page.locator('.racing-links a').first().getAttribute('href'), '/#material');
      await page.getByRole('button', { name: 'Tema terang', exact: true }).click();
      await page.waitForTimeout(650);
      assert.equal(await page.locator('.he-light').count(), 1);
      const cta = await page.locator('.racing-consult').evaluate(node => ({ ink: getComputedStyle(node).color, background: getComputedStyle(node).backgroundColor }));
      assert.notEqual(cta.ink, cta.background, 'Consultation label stays visible');
      await page.screenshot({ path: `artifacts/hero-editions/navbar-${width}-light.png`, fullPage: true });
      await page.getByRole('button', { name: 'Tema gelap', exact: true }).click();
      await page.waitForTimeout(650);
      assert.equal(await page.locator('.he-dark').count(), 1);
      if (width < 1000) {
        await page.getByRole('button', { name: 'Buka menu', exact: true }).click();
        assert.equal(await page.locator('.racing-links.is-open').isVisible(), true);
        assert.equal(await page.locator('.racing-mobile-consult').isVisible(), true);
        await page.screenshot({ path: `artifacts/hero-editions/navbar-${width}-menu.png`, fullPage: true });
        await page.keyboard.press('Escape');
        assert.equal(await page.getByRole('button', { name: 'Buka menu', exact: true }).getAttribute('aria-expanded'), 'false');
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.getByRole('button', { name: 'Info', exact: true }).click();
      const smallText = await page.locator('.he-preview').evaluate(root => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), failures = [];
        while (walker.nextNode()) {
          const text = walker.currentNode, element = text.parentElement;
          if (!text.textContent.trim() || !element || !element.getClientRects().length) continue;
          const style = getComputedStyle(element);
          if (style.visibility === 'hidden' || style.display === 'none') continue;
          if (parseFloat(style.fontSize) < 13) failures.push({ text: text.textContent.trim(), font: style.fontSize });
        }
        return failures;
      });
      assert.deepEqual(smallText, [], 'All visible text is at least 13px');
      await page.getByRole('button', { name: 'Tutup detail', exact: true }).click();
      assert.equal(errors.length, 0, errors.join('\n'));
      results.push({ width, labels, errors }); await context.close();
    }
    await fs.writeFile('artifacts/hero-editions/navbar-verification.json', JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
