import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import ts from 'typescript';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const source = await fs.readFile(new URL('../components/experience/splitHeroTiming.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
new Function('exports', code)(exports);
const { HERO_HOLD_MS, HERO_TRANSITION_MS, splitHeroFrame, splitHeroOpacity } = exports;
assert.equal(HERO_HOLD_MS, 3000);
assert.equal(HERO_TRANSITION_MS, 1000);
for (let t=0;t<=1;t+=.01) {
  const outgoing=splitHeroOpacity(t,false),incoming=splitHeroOpacity(t,true);
  assert.ok(outgoing>=0&&outgoing<=1&&incoming>=0&&incoming<=1);
  assert.ok(outgoing===0||incoming===0,'Vehicle silhouettes never overlap during the fade');
}
assert.equal(splitHeroOpacity(0,false),1);
assert.equal(splitHeroOpacity(1,true),1);
for (let cycle = 0; cycle < 8; cycle++) {
  const start = cycle * 4000;
  for (const offset of [0, 1, 1500, 2999, 3000]) {
    const state = splitHeroFrame(start + offset);
    assert.equal(state.current, cycle % 2);
    assert.equal(state.progress, 0, 'Every photo remains fully visible for three seconds');
  }
  assert.equal(splitHeroFrame(start + 3500).progress, .5);
  assert.ok(splitHeroFrame(start + 3999).progress > .998);
  assert.equal(splitHeroFrame(start + 4000).current, (cycle + 1) % 2);
  assert.equal(splitHeroFrame(start + 4000).progress, 0, 'Next hold starts without a timing gap');
}
for (const asset of ['ducati', 'byd', 'dark-bg', 'light-bg']) {
  const data = await fs.readFile(new URL(`../public/images/split-hero-${asset}.png`, import.meta.url));
  assert.equal(data.toString('hex', 0, 8), '89504e470d0a1a0a');
  assert.ok(data.readUInt32BE(16) > 1000 && data.readUInt32BE(20) >= 1000);
  const webp = await sharp(fileURLToPath(new URL(`../public/images/split-hero-${asset}.webp`, import.meta.url))).metadata();
  assert.equal(webp.width, data.readUInt32BE(16));
  assert.equal(webp.height, data.readUInt32BE(20));
  if (asset === 'ducati' || asset === 'byd') assert.equal(webp.hasAlpha, true, 'Vehicle transparency survives web compression');
}
console.log('Split hero: 3-second holds, 1-second transitions, 8 alternating slots and four image assets passed.');
for (const vehicle of ['ducati','byd'])for(const theme of ['light','dark']){
  const data=await sharp(fileURLToPath(new URL(`../public/images/split-hero-${vehicle}-${theme}.webp`,import.meta.url))).metadata();
  assert.equal(data.hasAlpha,true);
  assert.ok(data.width>1000&&data.height>=1000);
}
console.log('Four theme-specific vehicle photographs retain full dimensions and transparency.');
