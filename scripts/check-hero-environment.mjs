import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createHeroEnvironment} from '../components/experience/perfect-apply/environment.js';

const originalBake=THREE.PMREMGenerator.prototype.fromScene;
const originalDispose=THREE.PMREMGenerator.prototype.dispose;
const originalWarn=console.warn;
let disposed=0;
try {
 THREE.PMREMGenerator.prototype.dispose=function(){disposed++;};
 for(const fail of [false,true]) {
  const originalTarget={name:'previous target'};
  const originalHandler=()=>{};
  const renderer={debug:{onShaderError:originalHandler,checkShaderErrors:false},xr:{enabled:true},autoClear:false,
   getRenderTarget:()=>originalTarget,getActiveCubeFace:()=>2,getActiveMipmapLevel:()=>1,
   setRenderTarget:(target,face,mip)=>{assert.equal(target,originalTarget);assert.equal(face,2);assert.equal(mip,1);}};
  const baked={texture:{name:'environment'}};
  THREE.PMREMGenerator.prototype.fromScene=function(){
   renderer.xr.enabled=false;renderer.autoClear=true;
   if(fail) renderer.debug.onShaderError({getProgramInfoLog:()=>'',getShaderInfoLog:()=>''},{},{},{});
   return baked;
  };
  console.warn=()=>{};
  assert.equal(createHeroEnvironment(renderer),fail?null:baked);
  assert.equal(renderer.debug.onShaderError,originalHandler);
  assert.equal(renderer.debug.checkShaderErrors,false);
  assert.equal(renderer.xr.enabled,true);
  assert.equal(renderer.autoClear,false);
 }
 assert.equal(disposed,2);
 console.log('PASS: successful bake, shader failure fallback, renderer state restoration, PMREM disposal. GPU shader compilation is not exercised by this check.');
} finally {
 THREE.PMREMGenerator.prototype.fromScene=originalBake;
 THREE.PMREMGenerator.prototype.dispose=originalDispose;
 console.warn=originalWarn;
}
