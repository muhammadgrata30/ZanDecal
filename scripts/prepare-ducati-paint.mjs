import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Neutralize only red paint pixels; preserve the original lettering and UV layout.
const model = await fs.readFile(new URL("../public/models/2024_ducati_streetfighter_v4_s.glb", import.meta.url));
const jsonLength = model.readUInt32LE(12);
const gltf = JSON.parse(model.toString("utf8", 20, 20 + jsonLength));
const paint = gltf.materials.find(material => /Carpaint_Red/.test(material.name));
const texture = gltf.textures[paint.pbrMetallicRoughness.baseColorTexture.index];
const image = gltf.images[texture.source];
const view = gltf.bufferViews[image.bufferView];
const start = 28 + jsonLength + (view.byteOffset ?? 0);
const { data, info } = await sharp(model.subarray(start, start + view.byteLength)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let changed = 0;
for (let offset = 0; offset < data.length; offset += 4) {
  const r = data[offset], g = data[offset + 1], b = data[offset + 2];
  if (r > g * 1.6 && r > b * 1.6) {
    const neutral = Math.min(255, Math.round(r * 255 / 230));
    data[offset] = data[offset + 1] = data[offset + 2] = neutral;
    changed++;
  }
}
await sharp(data, { raw: info }).png().toFile(fileURLToPath(new URL("../public/models/ducati-paint-neutral.png", import.meta.url)));
console.log(`Prepared ${info.width}x${info.height} paint texture; neutralized ${changed} red pixels.`);
