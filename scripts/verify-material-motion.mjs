import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import { PlaneGeometry, Vector3 } from "three";

const source = await readFile(new URL("../lib/material-motion.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { materialPhase, materialTimeAtProgress, vinylPoint, materialRollShape, updateVinylBuffers } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
for (const [columns, rows] of [[64, 22], [32, 10], [20, 8]]) {
  const positions = new Float32Array((columns + 1) * (rows + 1) * 3);
  const normals = new Float32Array(positions.length);
  const widths = [];
  for (const progress of [1, .75, .5, .25, 0]) {
    const shape = materialRollShape(progress, true);
    updateVinylBuffers(positions, normals, columns, rows, shape.open, shape.wave, 0);
    const xs = [];
    for (let i = 0; i < positions.length; i += 3) {
      assert.ok(Number.isFinite(positions[i]) && Number.isFinite(positions[i + 2]));
      assert.ok(Math.abs(Math.hypot(normals[i], normals[i + 1], normals[i + 2]) - 1) < .00001);
      xs.push(positions[i]);
    }
    widths.push(Math.max(...xs) - Math.min(...xs));
  }
  assert.ok(widths[0] > 7.9, "Production sheet opens fully");
  assert.ok(widths[4] < 2.5, "Production recoil ends in a compact roll, not a half-open sheet");
}
for (let time = 0; time <= 72; time += .01) {
  const p = materialPhase(time);
  assert.ok(p >= 0 && p <= 1, "Animation remains within bounds");
  assert.ok(Math.abs(p - materialPhase(time + .001)) < .001, "Continuous animation, including loop seam");
}
assert.equal(materialPhase(0), 0);
assert.equal(materialPhase(9), 1);
assert.equal(materialPhase(18), 0);
for (let i = 0; i <= 100; i++) {
  const p = i / 100;
  assert.ok(Math.abs(materialPhase(materialTimeAtProgress(p)) - p) < .000001, "Manual playback resumes without a progress jump");
  for (let u = 0; u <= 1; u += .02) {
    for (const v of [0, .5, 1]) {
      const point = vinylPoint(u, v, p, .3, 2);
      assert.ok(point.every(Number.isFinite), "Finite vertices across entire deformation");
      const next = vinylPoint(u + .0001, v, p, .3, 2);
      assert.ok(Math.hypot(...point.map((x, axis) => x - next[axis])) < .01, "Continuous surface across curl boundary");
    }
  }
}
const closed = vinylPoint(1, .5, 0, 0, 0);
const open = vinylPoint(1, .5, 1, 0, 0, 0);
assert.ok(Math.hypot(...closed.map((x, axis) => x - open[axis])) > 3, "Large-scale deformation, not an idle wiggle");
// Use Three's real triangle index order so an inverted row direction cannot regress.
const plane = new PlaneGeometry(8, 3.8, 64, 22);
const face = [0, 1, 2].map(offset => {
  const vertex = plane.index.getX(offset);
  return new Vector3(...vinylPoint((vertex % 65) / 64, Math.floor(vertex / 65) / 22, 1, 0, 0));
});
const normal = face[1].clone().sub(face[0]).cross(face[2].clone().sub(face[0])).normalize();
assert.ok(normal.z > .999, "Unrolled colored front face points toward the camera, not backward");
plane.dispose();
console.log("Material motion passed: four continuous loops, bounded/reversible progress, jump-free manual resume, finite continuous foil geometry and large-scale travel. Browser rendering/FPS remains separate.");
