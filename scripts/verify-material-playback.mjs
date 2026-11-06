import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../lib/material-playback.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { initialMaterialPlayback, moveMaterial, advanceMaterial, finishMaterial, isMaterialMoving, MATERIAL_OPEN_SECONDS, MATERIAL_CLOSE_SECONDS } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
for (const fps of [20, 30, 60, 120]) {
  let state = moveMaterial(initialMaterialPlayback(), "opening");
  let elapsed = 0;
  while (isMaterialMoving(state) && elapsed < 6) { state = advanceMaterial(state, 1 / fps); elapsed += 1 / fps; }
  assert.equal(state.phase, "open"); assert.equal(state.progress, 1);
  assert.ok(Math.abs(elapsed - MATERIAL_OPEN_SECONDS) < 2 / fps, "Opening duration independent of frame rate");
  const held = state;
  for (let frame = 0; frame < 600; frame++) state = advanceMaterial(state, 1 / fps);
  assert.deepEqual(state, held, "Returning from below or changing choices cannot restart/recoil a fully open sheet");
  state = moveMaterial(state, "closing"); elapsed = 0;
  while (isMaterialMoving(state) && elapsed < 5) { state = advanceMaterial(state, 1 / fps); elapsed += 1 / fps; }
  assert.equal(state.phase, "closed"); assert.equal(state.progress, 0);
  assert.ok(Math.abs(elapsed - MATERIAL_CLOSE_SECONDS) < 2 / fps);
}
let state = moveMaterial(initialMaterialPlayback(), "opening");
for (let i = 0; i < 45; i++) state = advanceMaterial(state, 1 / 30);
const partial = state.progress;
state = { ...state, paused: true };
for (let i = 0; i < 300; i++) state = advanceMaterial(state, 1 / 30);
assert.equal(state.progress, partial, "Pause preserves exact progress");
state = moveMaterial(state, "closing");
assert.equal(state.progress, partial, "Reverse starts at current fold, without a jump");
state = advanceMaterial(state, 1 / 30); assert.ok(state.progress < partial);
state = finishMaterial(state);
assert.equal(state.phase, "open"); assert.equal(isMaterialMoving(state), false);
assert.equal(state.paused, false, "Skip/error/reduced-motion path releases animation gate");
assert.equal(advanceMaterial(state, 99).progress, 1, "No animation loop after completion");
const resumed = moveMaterial({ ...state, progress: .3, phase: "opening", paused: true }, "opening");
assert.equal(resumed.progress, .3); assert.equal(resumed.paused, false);
console.log("Homepage material playback passed at 20/30/60/120 FPS: first unroll, timing, held-open return, reverse, exact pause, skip/error release and no looping after completion.");
