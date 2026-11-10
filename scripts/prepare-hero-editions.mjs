import fs from 'node:fs/promises';
import sharp from 'sharp';

const out = 'public/design-preview/hero-editions';
await fs.mkdir(out, { recursive: true });
for (const [name, input, width] of [
  ['rolls', 'public/images/atelier-material.png', 1400],
  ['lacquer', 'public/images/consultation-vinyl.lossless.webp', 1600],
  ['automotive', 'public/images/atelier-hero.png', 1400],
  ['wordmark', 'public/brand/zan-wordmark-v3.png', 900],
]) {
  await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 84, effort: 6 }).toFile(`${out}/${name}.webp`);
  console.log(name, (await fs.stat(`${out}/${name}.webp`)).size);
}
const refs = [
  ['terminal', 'https://assets.awwwards.com/awards/submissions/2025/07/688419e0939f1847754167.png'],
  ['monolith', 'https://assets.awwwards.com/awards/submissions/2024/11/6744f00388630956013678.jpg'],
  ['david-whyte', 'https://assets.awwwards.com/awards/submissions/2024/12/6751daee78316611238976.jpg'],
];
for (const [name, url] of refs) {
  const response = await fetch(url); if (!response.ok) throw Error(`${name}: ${response.status}`);
  await sharp(Buffer.from(await response.arrayBuffer())).resize({ width: 1200 }).webp({ quality: 85 }).toFile(`${out}/reference-${name}.webp`);
  console.log('reference', name);
}
