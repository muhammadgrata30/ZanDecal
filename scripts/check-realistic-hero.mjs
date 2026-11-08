import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as THREE from 'three';
import {HDRLoader} from 'three/examples/jsm/loaders/HDRLoader.js';
import {createApply} from '../components/experience/perfect-apply/model.js';
import {applyRealisticMaterials} from '../components/experience/perfect-apply/realistic-materials.js';

for(const low of [false,true]){
 const model=createApply(low);
 const front=applyRealisticMaterials(model,low);
 assert(model.sheet.material.isMeshPhysicalMaterial);
 assert.equal(model.filmMaterial.metalness,0);
 assert.equal(model.printMaterial.metalness,0);
 assert(model.filmMaterial.clearcoat>.8);
 assert(model.tool.getObjectByName('tool-felt').material.sheen>0);
 for(let i=0;i<=60;i++){
  model.update(i/60,0,true);
  assert([...model.geometry.attributes.position.array].every(Number.isFinite));
  assert([...model.geometry.attributes.normal.array].every(Number.isFinite));
 }
 const shader={uniforms:{},vertexShader:THREE.ShaderLib.physical.vertexShader,fragmentShader:THREE.ShaderLib.physical.fragmentShader};
 model.filmMaterial.onBeforeCompile(shader);
 assert.equal(shader.uniforms.zanPressureFront,front);
 assert(shader.vertexShader.includes('zanSurfaceUv=uv;'));
 assert(shader.fragmentShader.includes('float laidDown='));
 assert(shader.fragmentShader.includes('roughnessFactor=clamp'));
 const geometries=new Set(),materials=new Set(),textures=new Set();
 model.root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material){materials.add(o.material);for(const v of Object.values(o.material))if(v?.isTexture)textures.add(v);}});
 textures.forEach(t=>t.dispose());materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());
}
const file=fs.readFileSync(new URL('../public/environments/studio_small_05_1k.hdr',import.meta.url));
const parsed=new HDRLoader().parse(file.buffer.slice(file.byteOffset,file.byteOffset+file.byteLength));
assert.equal(parsed.width,1024);assert.equal(parsed.height,512);assert(parsed.data.length>0);
console.log('PASS: both material tiers, film geometry, shader injection, and local 1024×512 HDRI decode.');
