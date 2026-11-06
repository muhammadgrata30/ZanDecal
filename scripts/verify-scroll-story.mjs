import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../lib/scroll-story.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { storyProgress, storyPose } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
for (const viewport of [568, 667, 844, 970]) {
  assert.equal(storyProgress(0, viewport * 4, viewport), 0);
  assert.equal(storyProgress(-viewport * 3, viewport * 4, viewport), 1);
  assert.equal(storyProgress(viewport, viewport * 4, viewport), 0);
}
for (const variant of [1, 2, 3, 4, 5]) for (const count of [1, 3, 8]) {
  for (let step = 0; step <= 1000; step++) {
    const progress = step / 1000;
    const poses = Array.from({ length: count }, (_, index) => storyPose(progress, index, count, variant));
    assert.equal(poses.filter(pose => pose.active).length, 1, "Exactly one readable active material");
    assert.ok(poses.every(pose => Object.values(pose).every(value => typeof value === "boolean" || Number.isFinite(value))));
    assert.ok(poses.every(pose => pose.opacity >= 0 && pose.opacity <= 1 && pose.clip >= 0 && pose.clip <= 1));
    if (step > 0) {
      const previous = storyPose((step - 1) / 1000, 0, count, variant);
      assert.ok(Math.abs(previous.x - poses[0].x) < 1 && Math.abs(previous.y - poses[0].y) < 1, "Continuous travel without position jumps");
    }
  }
  assert.equal(storyPose(0, 0, count, variant).active, true);
  assert.equal(storyPose(1, count - 1, count, variant).active, true);
}
assert.ok(storyPose(1, 0, 3, 1).y < -200, "Large vertical image journey");
assert.ok(storyPose(1, 0, 3, 2).x < -200, "Large horizontal archive journey");
assert.ok(storyPose(1, 0, 3, 3).rotate < -10, "Poster release has large spatial movement");
assert.equal(storyPose(0, 1, 3, 4).clip, 1);
assert.equal(storyPose(1, 2, 3, 4).clip, 0);
console.log("Five scroll stories passed: 15,015 scene samples, four viewport heights, active item, finite transforms, continuous/reversible travel, large displacement and wipe endpoints.");
