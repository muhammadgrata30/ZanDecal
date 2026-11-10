import {useEffect,useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import * as T from 'three';
import type {Design} from './design';
import type {StudioVehicle} from '../vehiclePaint';
import {findPanel} from '../../lib/studio-panels';
import {stickerTargets,stickerGeometry} from '../../lib/sticker-placement';
import {drawCamouflage,drawRace,MILITARY} from '../../lib/livery-artwork';
const createCanvas=()=>document.createElement('canvas');
export function DesignLayers({root,paint,design:d,color,vehicle,onPlacement}:{root:T.Group;paint:Set<T.MeshStandardMaterial>;design:Design;color:string;vehicle:StudioVehicle;onPlacement?:(id:string,status:boolean)=>void}){
 const invalidate=useThree(s=>s.invalidate);
 const targets=useMemo(()=>new Map<string,ReturnType<typeof stickerTargets>>(),[root]);
 useEffect(()=>()=>{targets.forEach(meshes=>meshes.forEach(mesh=>{if(mesh.userData.ownedGeometry)mesh.geometry.dispose()}));targets.clear();},[targets]);
 useEffect(()=>{
  let cancelled=false;const c=createCanvas(),top=createCanvas();
  const military=MILITARY.includes(d.pattern),isNone=d.pattern==='none';
  if(isNone){paint.forEach(material=>material.color.set(color));invalidate();return;}
  if(military)drawCamouflage(c,d.pattern,d.accent,color);else drawRace(c,d.pattern,color,d.accent);
  drawRace(top,d.pattern,color,d.accent,true);
  const map=new T.CanvasTexture(c),topMap=new T.CanvasTexture(top);[map,topMap].forEach(t=>{t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;});
  const previous=new Map<T.MeshStandardMaterial,{map:T.Texture|null;hook:T.MeshStandardMaterial['onBeforeCompile'];cache:T.MeshStandardMaterial['customProgramCacheKey']}>();
  const apply=()=>{if(cancelled)return;paint.forEach(m=>{
   if(!previous.has(m))previous.set(m,{map:m.map,hook:m.onBeforeCompile,cache:m.customProgramCacheKey});
   m.map=isNone?null:map;m.color.set(isNone?color:'#ffffff');
   m.onBeforeCompile=shader=>{
    shader.uniforms.studioTop={value:topMap};shader.uniforms.studioScale={value:d.scale/100};shader.uniforms.studioOpacity={value:d.opacity/100};shader.uniforms.studioBase={value:new T.Color(color)};
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 studioPosition;varying vec3 studioNormal;').replace('#include <begin_vertex>','#include <begin_vertex>\nstudioPosition=position;studioNormal=normal;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 studioPosition;varying vec3 studioNormal;uniform sampler2D studioTop;uniform float studioScale;uniform float studioOpacity;uniform vec3 studioBase;');
    if(!isNone)shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',military||d.pattern==='upload'?`
     vec3 blend=pow(abs(normalize(studioNormal)),vec3(6.));blend/=max(blend.x+blend.y+blend.z,.001);
     vec3 pos=studioPosition*studioScale*.65;
     vec4 tex=texture2D(map,pos.zy)*blend.x+texture2D(map,pos.xz)*blend.y+texture2D(map,pos.xy)*blend.z;
     diffuseColor.rgb*=mix(studioBase,tex.rgb,studioOpacity);
    `:`
     vec2 sideUV=vec2((studioPosition.x+2.2)/4.4,studioPosition.y/2.5);
     vec2 topUV=vec2(studioPosition.z/1.95+.5,(studioPosition.x+2.2)/4.4);
     float upBlend=smoothstep(.5,.85,abs(normalize(studioNormal).y));
     vec3 art=mix(texture2D(map,sideUV).rgb,texture2D(studioTop,topUV).rgb,upBlend);
     diffuseColor.rgb*=mix(studioBase,art,studioOpacity);
    `);
   };
   m.customProgramCacheKey=()=>`zan-livery-v3-${d.pattern}-${d.scale}-${d.opacity}-${color}-${d.accent}`;m.needsUpdate=true;
  });invalidate();};
  if(d.image&&d.pattern==='upload'){const image=new Image();image.onload=()=>{if(cancelled)return;c.width=c.height=1024;c.getContext('2d')!.drawImage(image,0,0,1024,1024);map.needsUpdate=true;apply();};image.src=d.image;}else apply();
  return()=>{cancelled=true;previous.forEach((old,m)=>{m.map=old.map;m.onBeforeCompile=old.hook;m.customProgramCacheKey=old.cache;m.color.set(color);m.needsUpdate=true;});map.dispose();topMap.dispose();};
 },[root,paint,d.pattern,d.image,d.accent,d.scale,d.opacity,color,invalidate]);
 useEffect(()=>{
  let cancelled=false;const decals:T.Mesh[]=[];const allocated=new Set<T.BufferGeometry>();
  for(const s of d.stickers){
   const preset=findPanel(vehicle,s.panel||(s.side==='Kanan'?(vehicle==='car'?'front-door-right':'tank-right'):undefined));
   const panel=s.point?{...preset,id:'custom',width:vehicle==='car'?.6:.4,height:vehicle==='car'?.3:.2}:preset;
   const targetKey=s.surfaceMesh||panel.id;
   if(!targets.has(targetKey))targets.set(targetKey,stickerTargets(root,paint,panel,s.surfaceMesh));
   const result=stickerGeometry(targets.get(targetKey)!,panel,s);
   if(!result||!result.geometries.length){onPlacement?.(s.id,false);continue;}
   result.geometries.forEach(g=>allocated.add(g));
   const c=createCanvas();c.width=1024;c.height=Math.max(128,Math.round(1024*panel.height/panel.width));const ctx=c.getContext('2d')!;
   const place=()=>{if(cancelled)return;const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;const material=new T.MeshStandardMaterial({map,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-6,roughness:.35,metalness:0,side:T.DoubleSide});
    for(const geometry of result.geometries){const mesh=new T.Mesh(geometry,material);mesh.userData.studioDecal=true;mesh.renderOrder=20+d.stickers.indexOf(s);root.add(mesh);decals.push(mesh);}onPlacement?.(s.id,true);invalidate();};
   if(s.image){const img=new Image();img.onload=()=>{if(cancelled)return;const scale=Math.min(c.width/img.width,c.height/img.height);ctx.drawImage(img,(c.width-img.width*scale)/2,(c.height-img.height*scale)/2,img.width*scale,img.height*scale);place();};img.onerror=()=>{if(!cancelled)onPlacement?.(s.id,false)};img.src=s.image;}
   else{ctx.fillStyle='#fff';ctx.font=`italic 900 ${Math.floor(c.height*.62)}px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s.text||s.name,c.width/2,c.height/2,c.width*.94);place();}
  }
  return()=>{cancelled=true;const materials=new Set<T.MeshStandardMaterial>();decals.forEach(m=>{root.remove(m);materials.add(m.material as T.MeshStandardMaterial)});allocated.forEach(g=>g.dispose());materials.forEach(m=>{m.map?.dispose();m.dispose()});};
 },[root,paint,vehicle,d.stickers,invalidate,onPlacement,targets]);
 return null;
}
