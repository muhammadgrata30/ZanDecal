import { readFile, writeFile, mkdir } from "node:fs/promises";
import { gzipSync, gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";

const directory = new URL("../public/models/transport/", import.meta.url);
await mkdir(directory, { recursive: true });
const manifest = [];
for (const name of ["2024_ducati_streetfighter_v4_s.glb", "byd-seal.glb"]) {
  const original = await readFile(new URL(`../public/models/${name}`, import.meta.url));
  const packed = gzipSync(original, { level: 9 });
  assert.deepEqual(gunzipSync(packed), original, "Lossless transport preserves every model byte, including textures and geometry");
  await writeFile(new URL(`${name}.gz`, directory), packed);
  manifest.push({ name, originalBytes: original.length, transferBytes: packed.length, savedPercent: Number((100 * (1 - packed.length / original.length)).toFixed(1)), sha256: createHash("sha256").update(original).digest("hex") });
}
await writeFile(new URL("manifest.json", directory), JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify(manifest, null, 2));
