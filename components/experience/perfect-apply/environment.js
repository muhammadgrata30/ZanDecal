import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

// Shader compilation failures are reported through Three's debug callback rather
// than thrown. Turn a failed environment bake into a recoverable lighting path;
// leave error reporting for every subsequent scene/material untouched.
export function createHeroEnvironment(renderer, low=false) {
 const room=new RoomEnvironment(),geometry=new THREE.BoxGeometry(),materials=[];
 const previousTarget=renderer.getRenderTarget();
 const previousCubeFace=renderer.getActiveCubeFace();
 const previousMipLevel=renderer.getActiveMipmapLevel();
 const previousErrorHandler=renderer.debug.onShaderError;
 const previousChecks=renderer.debug.checkShaderErrors;
 const previousAutoClear=renderer.autoClear;
 const previousXr=renderer.xr.enabled;
 let target=null;
 const pmrem=new THREE.PMREMGenerator(renderer);
 try {
  for(const [x,y,z,w,h,d,color,intensity] of [[-4,7,5,.25,7,2,0xf3f1f5,9],[5,4,3,.2,5,.7,0xf8fafc,12],[0,8,-4,7,.1,2,0xffffff,12]]){
   const material=new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity)});
   const strip=new THREE.Mesh(geometry,material);strip.position.set(x,y,z);strip.scale.set(w,h,d);room.add(strip);materials.push(material);
  }
  renderer.debug.checkShaderErrors=true;
  renderer.debug.onShaderError=(gl,program,vertex,fragment)=>{
   const details=[gl.getProgramInfoLog(program),gl.getShaderInfoLog(vertex),gl.getShaderInfoLog(fragment)].filter(Boolean).join('\n');
   throw new Error(details||'Environment shader could not compile on this WebGL driver.');
  };
  target=pmrem.fromScene(room,.012,.1,100,{size:low?128:256});
  return target;
 } catch(error) {
  target?.dispose();
  console.warn('Hero environment unavailable; using direct studio lighting.',error instanceof Error?error.message:error);
  return null;
 } finally {
  renderer.debug.onShaderError=previousErrorHandler;
  renderer.debug.checkShaderErrors=previousChecks;
  renderer.autoClear=previousAutoClear;
  renderer.xr.enabled=previousXr;
  renderer.setRenderTarget(previousTarget,previousCubeFace,previousMipLevel);
  room.dispose();geometry.dispose();materials.forEach(material=>material.dispose());pmrem.dispose();
 }
}
