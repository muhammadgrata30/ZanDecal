const { chromium } = require(process.env.HERO_PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs/promises');
const sharp = require('sharp');
const assert = require('node:assert/strict');

(async () => {
  await fs.mkdir('artifacts/hero-editions', { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
  const results = [];
  try {
    for (const mobile of [false, true]) {
      const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
      await context.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 }); Object.defineProperty(navigator, 'deviceMemory', { get: () => 4 }); });
      const page = await context.newPage();
      for (let id = 1; id <= 5; id++) {
        const errors = [], heavy = [];
        const onError = error => errors.push(error.message);
        const onRequest = request => { if (/\.(hdr|glb|mp4)(\?|$)/.test(request.url())) heavy.push(request.url()); };
        page.on('pageerror', onError); page.on('request', onRequest);
        await page.goto(`http://localhost:3000/hero-editions/${id}`, { waitUntil: 'networkidle' });
        const canvas = page.locator('.he-material-canvas');
        await page.waitForFunction(() => document.querySelector('.he-material-canvas')?.dataset.pass === 'rest', { timeout: 30000 });
        await page.getByRole('button', { name: 'Jeda animasi', exact: true }).click();
        await page.waitForTimeout(300);
        const filename = `artifacts/hero-editions/${mobile ? 'mobile' : 'desktop'}-${id}.png`;
        await page.screenshot({ path: filename, fullPage: true });
        if (!mobile) {
          await sharp(filename).resize({ width: 1152 }).webp({ quality: 83 }).toFile(`public/design-preview/hero-editions/preview-${id}.webp`);
          const isolate = await page.addStyleTag({ content: 'html,body,.he-preview{background:transparent!important}.he-preview>*:not(.he-object){visibility:hidden!important}' });
          const buffer = await page.locator('.he-object').screenshot({ omitBackground: true });
          await sharp(buffer).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 84 }).toFile(`public/design-preview/hero-editions/poster-${id}.webp`);
          await isolate.evaluate(node => node.remove());
        }
        const state = await page.evaluate(() => {
          const c = document.querySelector('.he-material-canvas'), h = document.querySelector('h1').getBoundingClientRect();
          return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, calls: +c.dataset.drawCalls, triangles: +c.dataset.triangles, fpsCap: +c.dataset.fpsCap, pixelRatio: +c.dataset.pixelRatio, frames: +c.dataset.frames, heading: { left: h.left, right: h.right, top: h.top, bottom: h.bottom }, bodyText: document.querySelector('.he-caption').getBoundingClientRect().bottom, dockTop: document.querySelector('.he-switcher').getBoundingClientRect().top };
        });
        await page.waitForTimeout(500);
        const afterPause = +(await canvas.getAttribute('data-frames'));
        assert.equal(afterPause, state.frames, 'Paused renderer is idle');
        assert.ok(state.scrollWidth <= state.width, 'No horizontal overflow');
        assert.ok(state.calls <= 5, 'At most five draw calls');
        assert.ok(state.triangles < 5000, 'Small geometry budget');
        assert.equal(errors.length, 0, errors.join('\n')); assert.equal(heavy.length, 0, 'No HDR, vehicle model or video downloads');
        assert.ok(state.bodyText < state.dockTop, 'Caption does not sit under preview controls');
        await page.getByRole('button', { name: 'Info', exact: true }).click();
        assert.equal(await page.locator('.he-info').isVisible(), true);
        await page.getByRole('button', { name: 'Tutup detail', exact: true }).click();
        const isDark = await page.locator('.he-preview').evaluate(node => node.classList.contains('he-dark'));
        await page.getByRole('button', { name: id === 2 ? (isDark ? 'Tema terang' : 'Tema gelap') : (isDark ? 'Light' : 'Dark'), exact: true }).click();
        await page.waitForTimeout(600);
        await page.screenshot({ path: `artifacts/hero-editions/${mobile ? 'mobile' : 'desktop'}-${id}-theme.png`, fullPage: true });
        await page.getByRole('button', { name: id === 2 ? (isDark ? 'Tema gelap' : 'Tema terang') : (isDark ? 'Dark' : 'Light'), exact: true }).click();
        await page.getByRole('button', { name: 'Hemat', exact: true }).click();
        assert.equal(await page.locator('.he-material-canvas').count(), 0, 'Hemat completely removes WebGL');
        await page.locator('.he-object-static img').waitFor();
        await page.waitForFunction(() => { const image = document.querySelector('.he-object-static img'); return image?.complete && image.naturalWidth > 0; });
        assert.equal(await page.locator('.he-object-static img').evaluate(node => node.complete && node.naturalWidth > 0), true, 'Actual static poster loads');
        await page.getByRole('button', { name: 'Aktifkan 3D', exact: true }).click();
        await page.locator('.he-material-canvas[data-frames]').waitFor();
        if (id === 5) { await page.getByRole('button', { name: 'Buka identitasnya', exact: true }).click(); assert.equal(await page.locator('.he-reveal').count(), 1); }
        if (mobile) { await page.getByRole('button', { name: 'Buka menu', exact: true }).click(); assert.equal(await page.locator(id === 2 ? '.racing-links.is-open' : '.he-menu-open').isVisible(), true); await page.getByRole('button', { name: 'Tutup menu', exact: true }).click(); }
        results.push({ id, mobile, ...state, pausedFrameDelta: afterPause - state.frames, errors, heavy });
        console.log(JSON.stringify(results.at(-1)));
        page.removeListener('pageerror', onError); page.removeListener('request', onRequest);
      }
      await context.close();
    }
    const reduced = await browser.newContext({ viewport: { width: 360, height: 800 }, reducedMotion: 'reduce' });
    const page = await reduced.newPage();
    await page.goto('http://localhost:3000/hero-editions/1', { waitUntil: 'networkidle' });
    await page.locator('.he-material-canvas[data-frames]').waitFor();
    const before = +(await page.locator('.he-material-canvas').getAttribute('data-frames'));
    await page.waitForTimeout(700);
    assert.equal(+(await page.locator('.he-material-canvas').getAttribute('data-frames')), before, 'Reduced motion stays still');
    await reduced.close();
    await fs.writeFile('artifacts/hero-editions/verification.json', JSON.stringify(results, null, 2));
    console.log('PASS: 5 editions, desktop/mobile, themes, static fallback, pause, geometry budgets, reduced motion.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
