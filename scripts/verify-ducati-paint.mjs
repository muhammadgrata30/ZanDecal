import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { isVehiclePaint } from "../components/vehiclePaint.ts";

const glb = await fs.readFile(new URL("../public/models/2024_ducati_streetfighter_v4_s.glb", import.meta.url));
const length = glb.readUInt32LE(12);
const gltf = JSON.parse(glb.toString("utf8", 20, 20 + length));
const panels = gltf.materials.filter(material => isVehiclePaint("ducati", "Object", material.name));
assert.deepEqual(panels.map(material => material.name), [
  "MAT_Ducati_StreetFighter_V4S_Carpaint_Red.028",
  "MAT_Ducati_StreetFighter_V4S_Carpaint_Red.018",
  "MAT_Ducati_StreetFighter_V4S_Carpaint_Red",
]);
for (const material of gltf.materials.filter(material => !panels.includes(material))) {
  assert.equal(isVehiclePaint("ducati", "body frame paint", material.name), false,
    `Protected Ducati material was selected: ${material.name}`);
}
const texture = gltf.textures[panels[0].pbrMetallicRoughness.baseColorTexture.index];
const image = gltf.images[texture.source];
const view = gltf.bufferViews[image.bufferView];
const start = 28 + length + (view.byteOffset ?? 0);
const original = await sharp(glb.subarray(start, start + view.byteLength)).ensureAlpha().raw().toBuffer();
const neutral = await sharp(fileURLToPath(new URL("../public/models/ducati-paint-neutral.png", import.meta.url))).ensureAlpha().raw().toBuffer();
assert.equal(neutral.length, original.length);
let preserved = 0, changed = 0;
for (let offset = 0; offset < original.length; offset += 4) {
  const r = original[offset], g = original[offset + 1], b = original[offset + 2];
  if (r > g * 1.6 && r > b * 1.6) {
    assert.equal(neutral[offset], neutral[offset + 1]);
    assert.equal(neutral[offset], neutral[offset + 2]);
    changed++;
  } else {
    assert.deepEqual(neutral.subarray(offset, offset + 4), original.subarray(offset, offset + 4));
    preserved++;
  }
}
assert.ok(changed > 1000000);
assert.ok(preserved > 5000, "Lettering/detail pixels must be preserved");
console.log(`PASS: 3 paint materials; ${gltf.materials.length - panels.length} protected materials; ${changed} neutral paint pixels; ${preserved} original detail pixels preserved.`);
