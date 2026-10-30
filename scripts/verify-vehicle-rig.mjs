import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import ts from 'typescript';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

globalThis.self = globalThis;
globalThis.createImageBitmap = async () => ({ width: 1, height: 1, close() {} });
async function moduleFrom(path, dependencies = {}) {
  const source = await fs.readFile(new URL(path, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const exports = {};
  new Function('require', 'exports', output)(name => {
    if (name === 'three') return THREE;
    if (name in dependencies) return dependencies[name];
    throw new Error(`Unexpected dependency ${name}`);
  }, exports);
  return exports;
}
const paint = await moduleFrom('../components/vehiclePaint.ts');
const { buildVehicleRig } = await moduleFrom('../components/experience/vehicleRig.ts', { '../vehiclePaint': paint });
function triangles(root) {
  let count = 0;
  root.traverse(node => { if (node.isMesh) count += (node.geometry.index?.count ?? node.geometry.attributes.position.count) / 3; });
  return count;
}
for (const [vehicle, file, wheelCount] of [['ducati', '2024_ducati_streetfighter_v4_s.glb', 2], ['car', 'byd-seal.glb', 4]]) {
  const bytes = await fs.readFile(new URL('../public/models/' + file, import.meta.url));
  const { scene } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  const original = triangles(scene);
  const rig = buildVehicleRig(scene, vehicle, new THREE.Texture({ width: 1, height: 1 }));
  assert.equal(rig.wheels.length, wheelCount);
  assert.equal(triangles(rig.root), original, 'No triangles lost during wheel separation');
  assert.equal(triangles(scene), original, 'Source model preserved');
  assert.ok(rig.paint.size > 0);
  if (vehicle === 'ducati') assert.equal(rig.paint.size, 3);
  for (const wheel of rig.wheels) assert.ok(wheel.radius > .1 && wheel.radius < 1);
  const bounds = new THREE.Box3().setFromObject(rig.root);
  assert.ok(Math.abs(bounds.min.y) < .001, 'Vehicle rests on ground');
  console.log(`${vehicle}: ${wheelCount} wheels, ${rig.paint.size} paint materials, ${original} triangles preserved`);
  rig.dispose();
}
const { journeyPose, pinchScale } = await moduleFrom('../components/experience/journeyMath.ts');
assert.equal(journeyPose(0).distance, 0);
assert.equal(journeyPose(1).studio, 1);
for (let p = .001; p <= 1; p += .001) {
  const a = journeyPose(p - .001), b = journeyPose(p);
  assert.ok(Math.abs(b.x - a.x) < .25 && Math.abs(b.yaw - a.yaw) < .02, 'Continuous scroll path');
}
for (const [start, end] of [[.02, .35], [.53, .91]]) {
  for (let p = start + .001; p < end; p += .001) {
    const a = journeyPose(p - .001), b = journeyPose(p);
    assert.ok(b.x >= a.x, 'Vehicle drives forward, never circles or reverses in the visible bay');
    assert.ok(Math.abs((b.distance - a.distance) - (b.x - a.x)) < .00001, 'Wheel travel matches physical translation');
  }
}
assert.ok(journeyPose(.53).x < -10, 'Studio arrival starts offscreen left');
assert.ok(Math.abs(journeyPose(1).x - 1.1) < .00001, 'Vehicle stops in display bay');
assert.equal(journeyPose(.44).shutter, 1, 'Shutter conceals room switch');
assert.equal(journeyPose(0).shutter, 0);
assert.equal(journeyPose(1).shutter, 0);
assert.ok(pinchScale(-20) < 1 && pinchScale(20) > 1, 'Pinch direction');
assert.equal(pinchScale(0), 1);
console.log('Scroll path: forward departure, left-to-right arrival, wheel distance, shutter and pinch scale passed');
const journey = await moduleFrom('../components/experience/journeyMath.ts');
for(let p=.001;p<=1;p+=.001){
  const a=journey.studioEntrancePose(p-.001),b=journey.studioEntrancePose(p);
  const oldPose=journey.journeyPose(a.journey),newPose=journey.journeyPose(b.journey);
  assert.ok(newPose.x>=oldPose.x,'Pinned studio vehicle travels left to right');
  assert.ok(Math.abs(newPose.x-oldPose.x)<.15,'Pinned studio motion is continuous');
}
assert.equal(journey.studioEntrancePose(.2).shutter,1,'Garage door fully closes before opening');
assert.equal(journey.studioEntrancePose(1).shutter,0,'Garage door is open at the end');
assert.equal(journey.studioEntrancePose(1).controls,1,'Studio controls appear after arrival');
assert.ok(journey.journeyPose(journey.studioEntrancePose(0).journey).x < -10);
assert.ok(Math.abs(journey.journeyPose(journey.studioEntrancePose(1).journey).x-1.1)<.0001);
const sequence=journey.heroStudioSequencePose;
assert.equal(sequence(.15).door,0,'Hero remains unobstructed during the initial pinned hold');
assert.equal(sequence(.15).studioVisible,false);
assert.equal(sequence(.36).door,1);
assert.equal(sequence(.36).studioVisible,false);
assert.equal(sequence(.37).door,1,'Scene swaps only behind a fully closed garage door');
assert.equal(sequence(.37).studioVisible,true);
assert.equal(sequence(1).door,0);
assert.equal(sequence(1).studioProgress,1);
for(let p=.001;p<=1;p+=.001){
  const a=sequence(p-.001),b=sequence(p);
  assert.ok(b.studioProgress>=a.studioProgress,'Studio entry follows forward scroll continuously');
  assert.ok(Math.abs(b.door-a.door)<.015,'Garage door movement is continuous');
}
console.log('Pinned sequence: hero hold, covered scene switch, garage reopening and studio arrival passed');
const { heroMotion } = await moduleFrom('../components/hero-motion/motionMath.ts', { '../experience/journeyMath': journey });
for (const option of [1, 3]) {
  const start = heroMotion(option, 0, 0), arrived = heroMotion(option, 3, 0);
  assert.ok(arrived.x > start.x, 'Intro translates motorcycle forward');
  assert.ok(Math.abs((arrived.x - start.x) - arrived.distance) < .00001, 'Intro wheel travel matches distance');
  for (let p = .001; p <= 1; p += .001) {
    const a = heroMotion(option, 3, p-.001), b = heroMotion(option, 3, p);
    assert.ok(b.x >= a.x && Math.abs(b.x-a.x)<.02, 'Smooth forward scroll movement');
    assert.ok(Math.abs((b.x-a.x)-(b.distance-a.distance))<.00001, 'Scroll wheel travel matches distance');
  }
  assert.equal(heroMotion(option, 3, 1).reveal, 1);
}
console.log('Hero previews 1 and 3: approach, wheel travel, continuity and scroll reveal passed');
