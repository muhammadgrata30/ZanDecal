import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { PlaneGeometry } from "three";
import ts from "typescript";

async function load(relative) {
  const source = await readFile(new URL(relative, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}
const { vinylPoint, updateVinylBuffers } = await load("../lib/material-motion.ts");
const { MATERIAL_QUALITY: budgets, initialMaterialQuality, lowerMaterialQuality, effectiveMaterialQuality } = await load("../lib/material-quality.ts");
assert.equal(initialMaterialQuality(true), "mobile", "Unknown mobile hardware starts conservatively");
assert.equal(initialMaterialQuality(true, 8, 8), "mobile");
assert.equal(initialMaterialQuality(true, 4, 8), "lite");
assert.equal(initialMaterialQuality(true, 8, 4), "lite");
assert.equal(initialMaterialQuality(false, 16, 16, true), "lite");
assert.equal(initialMaterialQuality(false, 16, 16), "desktop");
assert.equal(lowerMaterialQuality(lowerMaterialQuality("desktop")), "lite");
assert.equal(lowerMaterialQuality("lite"), "lite");
assert.equal(effectiveMaterialQuality("mobile", "desktop"), "mobile", "Cannot accidentally upgrade beyond device budget");
assert.equal(effectiveMaterialQuality("mobile", "lite"), "lite");

let checkedVertices = 0;
for (const budget of Object.values(budgets)) {
  const count = (budget.columns + 1) * (budget.rows + 1);
  const positions = new Float32Array(count * 3), normals = new Float32Array(count * 3);
  for (const open of [0, .15, .5, .85, 1]) for (const wave of [0, .8]) {
    updateVinylBuffers(positions, normals, budget.columns, budget.rows, open, wave, 2.7);
    for (let row = 0; row <= budget.rows; row++) for (let col = 0; col <= budget.columns; col++) {
      const u = col / budget.columns, v = row / budget.rows, offset = (row * (budget.columns + 1) + col) * 3;
      const expected = vinylPoint(u, v, open, wave, 2.7);
      for (let axis = 0; axis < 3; axis++) assert.ok(Math.abs(positions[offset + axis] - expected[axis]) < .000002, "Optimized deformation preserves original animation coordinates");
      const normal = normals.subarray(offset, offset + 3);
      assert.ok(normal.every(Number.isFinite));
      assert.ok(Math.abs(Math.hypot(...normal) - 1) < .000001);
      if (Math.abs(u - open) > .002) {
        const epsilon = .00001, right = vinylPoint(u + epsilon, v, open, wave, 2.7), down = vinylPoint(u, v + epsilon, open, wave, 2.7);
        const du = right.map((x, i) => x - expected[i]), dv = down.map((x, i) => x - expected[i]);
        const cross = [dv[1] * du[2] - dv[2] * du[1], dv[2] * du[0] - dv[0] * du[2], dv[0] * du[1] - dv[1] * du[0]];
        const dot = cross.reduce((sum, x, i) => sum + x * normal[i], 0) / Math.hypot(...cross);
        assert.ok(dot > .999, "Analytical normals match independently sampled surface orientation");
      }
      checkedVertices++;
    }
  }
}
assert.equal(budgets.mobile.shadows, false);
assert.equal(budgets.lite.shadows, false);
assert.equal(budgets.mobile.fps, 30);
assert.equal(budgets.lite.dpr, 1);

const frames = 100, sheets = 4;
function benchmark(budget, legacy = false) {
  const geometry = new PlaneGeometry(8, 3.8, budget.columns, budget.rows);
  const runs = [];
  for (let run = 0; run < 6; run++) {
    const start = performance.now();
    for (let frame = 0; frame < frames; frame++) for (let sheet = 0; sheet < sheets; sheet++) {
      const open = .5 + .49 * Math.sin(frame / 25), wave = .4, time = frame / 30;
      if (legacy) {
        for (let row = 0; row <= budget.rows; row++) for (let column = 0; column <= budget.columns; column++) {
          const point = vinylPoint(column / budget.columns, row / budget.rows, open, wave, time);
          geometry.attributes.position.setXYZ(row * (budget.columns + 1) + column, ...point);
        }
        geometry.computeVertexNormals();
      } else updateVinylBuffers(geometry.attributes.position.array, geometry.attributes.normal.array, budget.columns, budget.rows, open, wave, time);
    }
    if (run > 0) runs.push((performance.now() - start) / frames);
  }
  geometry.dispose();
  return Number(runs.sort((a, b) => a - b)[Math.floor(runs.length / 2)].toFixed(3));
}
const report = {
  generatedAt: new Date().toISOString(),
  scope: "Node CPU-only deformation benchmark on this computer; four sheets per update. Excludes WebGL, GPU, browser interaction and phone hardware. Not a mobile FPS result.",
  checkedVertices,
  legacyCpuMsPerFourSheets: benchmark(budgets.desktop, true),
  profiles: Object.fromEntries(Object.entries(budgets).map(([name, budget]) => [name, { ...budget, verticesPerSheet: (budget.columns + 1) * (budget.rows + 1), optimizedCpuMsPerFourSheets: benchmark(budget) }])),
};
await mkdir(new URL("../artifacts/", import.meta.url), { recursive: true });
await writeFile(new URL("../artifacts/material-mobile-check.json", import.meta.url), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
console.log("PASS: device budgets, quality downgrade, shadow/DPR limits, original positions and analytical normal orientation. Actual phone touch, shader rendering and frame rate remain unverified.");
