import assert from 'node:assert/strict';
import * as THREE from 'three';
import {studioCameraLimits,studioBoxFit} from '../lib/studio-camera.js';
let cases=0;
for(const [width,height] of [[320,430],[390,430],[600,530],[900,560],[1600,560]])for(const radius of [2.3,2.9]){
 const fit=studioCameraLimits(radius,width/height,36,height);
 assert(fit.initial>fit.minimum&&fit.maximum>fit.initial);
 assert(fit.initial/fit.minimum>=1.4,'Zoom-in range must remain clearly noticeable.');
 for(let angle=0;angle<Math.PI*2;angle+=Math.PI/4){
  const center=new THREE.Vector3(0,1,0),camera=new THREE.PerspectiveCamera(36,width/height,.1,100);
  camera.position.copy(center).add(new THREE.Vector3(Math.sin(angle),.25,Math.cos(angle)).normalize().multiplyScalar(fit.minimum));camera.lookAt(center);camera.updateMatrixWorld();
  for(let u=0;u<32;u++)for(let v=0;v<=16;v++){
   const phi=v/16*Math.PI,theta=u/32*Math.PI*2;
   const point=new THREE.Vector3(radius*Math.sin(phi)*Math.cos(theta),radius*Math.cos(phi),radius*Math.sin(phi)*Math.sin(theta)).add(center).project(camera);
   assert(Math.abs(point.x)<.88&&Math.abs(point.y)<fit.verticalSpace,`Clipped at ${width}×${height}`);
  }
  cases++;
 }
}
console.log(`PASS: full-model zoom framing in ${cases} device/size/orbit combinations.`);
let tightCases=0;
for(const [width,height] of [[320,430],[390,430],[600,530],[900,560],[1600,560]])for(const halfSize of [[2.15,1.2,.75],[2.15,.7,.95]]){
 for(let angle=0;angle<Math.PI*2;angle+=Math.PI/4)for(const elevation of [.2,.6,1.2]){
  const direction=new THREE.Vector3(Math.sin(angle)*Math.cos(elevation),Math.sin(elevation),Math.cos(angle)*Math.cos(elevation));
  const fit=studioBoxFit(halfSize,direction.toArray(),width/height,36,height);
  const camera=new THREE.PerspectiveCamera(36,width/height,.1,100);camera.position.copy(direction).multiplyScalar(fit);camera.lookAt(0,0,0);camera.updateMatrixWorld();
  const safe=studioCameraLimits(Math.hypot(...halfSize),width/height,36,height);
  for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1]){
   const point=new THREE.Vector3(x*halfSize[0],y*halfSize[1],z*halfSize[2]).project(camera);
   assert(Math.abs(point.x)<.92&&Math.abs(point.y)<safe.verticalSpace,'Tight fit must retain the entire model.');
  }
  tightCases++;
 }
}
const carSize=[2.15,.7,.95],direction=[1,.17,0];
assert(studioCameraLimits(Math.hypot(...carSize),1.5).initial/studioBoxFit(carSize,direction,1.5)>1.8,'Front-view zoom must be substantially stronger than the old sphere limit.');
console.log(`PASS: tighter full-model fit in ${tightCases} box/viewport/orbit cases and visibly larger zoom.`);
