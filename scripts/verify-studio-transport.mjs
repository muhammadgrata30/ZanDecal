import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";

const manifest = JSON.parse(await readFile(new URL("../public/models/transport/manifest.json", import.meta.url), "utf8"));
for (const model of manifest) {
  const original = await readFile(new URL(`../public/models/${model.name}`, import.meta.url));
  const compressed = await readFile(new URL(`../public/models/transport/${model.name}.gz`, import.meta.url));
  assert.deepEqual(gunzipSync(compressed), original);
  assert.equal(createHash("sha256").update(original).digest("hex"), model.sha256);
  if (process.argv.includes("--live")) {
    const response = await fetch(`http://localhost:3000/models/transport/${model.name}.gz`, { signal: AbortSignal.timeout(60000) });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-encoding"), "gzip", "Browser must receive the correct transfer encoding");
    const decoded = Buffer.from(await response.arrayBuffer());
    assert.deepEqual(decoded, original, "HTTP automatically decompresses to the exact original GLB");
  }
  console.log(`${model.name}: ${model.savedPercent}% smaller transfer, identical model bytes${process.argv.includes("--live") ? ", live HTTP decode passed" : ""}`);
}
