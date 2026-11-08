import * as THREE from 'three';

// Optical properties of laminated polymer: dielectric base + clear laminate.
// The coating responds to the actual tool position, not an animated logo.
export function applyRealisticMaterials(model, low=false){
 const base=model.filmMaterial;
 const vinyl=new THREE.MeshPhysicalMaterial({color:base.color,roughness:.24,metalness:0,ior:1.48,clearcoat:.92,clearcoatRoughness:.12,envMapIntensity:.85,side:THREE.FrontSide});
 model.sheet.material=vinyl;model.filmMaterial=vinyl;base.dispose();
 const front={value:0};
 vinyl.onBeforeCompile=shader=>{
  shader.uniforms.zanPressureFront=front;
  shader.vertexShader='varying vec2 zanSurfaceUv;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nzanSurfaceUv=uv;');
  shader.fragmentShader='uniform float zanPressureFront;\nvarying vec2 zanSurfaceUv;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
float laidDown=1.0-smoothstep(zanPressureFront-0.04,zanPressureFront+0.04,zanSurfaceUv.x);
float grain=fract(sin(dot(floor(zanSurfaceUv*vec2(1800.0,1200.0)),vec2(12.9898,78.233)))*43758.5453);
roughnessFactor=clamp(roughnessFactor+mix(0.09,0.0,laidDown)+(grain-0.5)*0.022,0.12,0.65);`);
 };
 vinyl.customProgramCacheKey=()=> 'zan-laminated-polymer-v1';
 const oldPrint=model.printMaterial;
 const print=new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.26,metalness:0,clearcoat:.92,clearcoatRoughness:.12,ior:1.48,transparent:true,opacity:0,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,side:THREE.FrontSide});
 model.root.getObjectByName('zan-print').material=print;model.printMaterial=print;oldPrint.dispose();
 const pixels=new Uint8Array(128*128*4);let seed=231;
 for(let i=0;i<pixels.length;i+=4){seed=(seed*1664525+1013904223)>>>0;const value=116+seed%24;pixels[i]=value;pixels[i+1]=value;pixels[i+2]=value;pixels[i+3]=255;}
 const grainMap=new THREE.DataTexture(pixels,128,128,THREE.RGBAFormat);grainMap.wrapS=grainMap.wrapT=THREE.RepeatWrapping;grainMap.repeat.set(9,7);grainMap.magFilter=grainMap.minFilter=THREE.LinearFilter;grainMap.needsUpdate=true;
 if(!low){vinyl.bumpMap=grainMap;vinyl.bumpScale=.0012;print.bumpMap=grainMap;print.bumpScale=.0008;}
 model.housing.metalness=0;model.housing.roughness=.48;
 model.liner.position.z=-.32;model.liner.material.roughness=.78;model.liner.material.metalness=0;
 model.root.traverse(object=>{
  if(object.isMesh&&object.name!=='soft-shadow'){object.castShadow=object.name!=='zan-print';object.receiveShadow=true;}
 });
 const felt=model.tool.getObjectByName('tool-felt');
 if(felt){felt.material=new THREE.MeshPhysicalMaterial({color:0x202127,roughness:.96,metalness:0,sheen:.55,sheenColor:0x7c7a80,sheenRoughness:.9,bumpMap:grainMap,bumpScale:.008});}
 return front;
}
