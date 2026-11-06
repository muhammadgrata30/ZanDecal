import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../lib/material-motion.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { updateVinylBuffers, applyHoodWrap } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
for (const [columns, rows] of [[64, 22], [32, 10], [20, 8]]) {
  const length = (columns + 1) * (rows + 1) * 3;
  const positions = new Float32Array(length), normals = new Float32Array(length);
  updateVinylBuffers(positions, normals, columns, rows, .5, .12, 2);
  const original = positions.slice();
  applyHoodWrap(positions, normals, columns, rows, 0);
  assert.deepEqual(positions, original, "Wrap starts at the original sheet position");
  for (const progress of [.1, .5, .9, 1]) {
    updateVinylBuffers(positions, normals, columns, rows, .5 + progress * .5, .2, 2);
    applyHoodWrap(positions, normals, columns, rows, progress);
    assert.ok(positions.every(Number.isFinite));
    for (let i = 0; i < length; i += 3) assert.ok(Math.abs(Math.hypot(normals[i], normals[i + 1], normals[i + 2]) - 1) < .00001, "Unit normals throughout wrapping");
  }
  assert.ok(Math.abs(positions[0] + 2.624) < .00001, "Top of hood is narrower than the bottom");
  const lastRow = rows * (columns + 1) * 3;
  assert.ok(Math.abs(positions[lastRow] + 3.2) < .00001);
  const front = positions.slice();
  const under = new Float32Array(length), underNormals = new Float32Array(length);
  updateVinylBuffers(under, underNormals, columns, rows, 1, 0, 0);
  applyHoodWrap(under, underNormals, columns, rows, 1, 0);
  for (let i = 0; i < length; i += 3) {
    assert.ok(Math.abs(front[i] - under[i]) < .00001);
    assert.ok(Math.abs(front[i + 1] - under[i + 1]) < .00001);
    assert.ok(Math.abs(front[i + 2] - under[i + 2] - .035) < .00001, "Film remains above hood base without coincident surfaces");
    assert.ok(underNormals[i + 2] > 0, "Completed hood faces the viewer");
  }
}
console.log("Wrap study passed at desktop/mobile/lite detail: sheet start, finite deformation, unit normals, tapered hood perimeter, completed front orientation and film/base separation. Actual WebGL/visual QA remains separate.");
