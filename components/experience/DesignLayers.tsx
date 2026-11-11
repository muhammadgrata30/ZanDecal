import {useEffect,useRef} from 'react';
import {useThree} from '@react-three/fiber';
import * as T from 'three';
import type {Design} from './design';
import type {StudioVehicle} from '../vehiclePaint';
import {findPanel} from '../../lib/studio-panels';
import {stickerTargets,stickerGeometry} from '../../lib/sticker-placement';
import {drawCamouflage,drawRace,MILITARY} from '../../lib/livery-artwork';
import {bindLiveryMaterial} from '../../lib/studio-livery-material';
const createCanvas=()=>document.createElement('canvas');
export function DesignLayers({root,paint,design:d,color,vehicle,onPlacement,onLiveryError}:{root:T.Group;paint:Set<T.MeshStandardMaterial>;design:Design;color:string;vehicle:StudioVehicle;onPlacement?:(id:string,status:boolean)=>void;onLiveryError?:(message:string)=>void}){
 const invalidate=useThree(s=>s.invalidate);
 const targetCache=useRef(new Map<string,ReturnType<typeof stickerTargets>>());
 useEffect(()=>{const targets=targetCache.current;return()=>{targets.forEach(meshes=>meshes.forEach(mesh=>{if(mesh.userData.ownedGeometry)mesh.geometry.dispose()}));targets.clear();};},[root]);
 const binding=useRef<ReturnType<typeof bindLiveryMaterial>|null>(null);
 const resources=useRef<{side:HTMLCanvasElement;top:HTMLCanvasElement;map:T.CanvasTexture;topMap:T.CanvasTexture}|null>(null);
 useEffect(()=>{
  const side=createCanvas(),top=createCanvas();
  side.width=side.height=top.width=top.height=1024;
  const map=new T.CanvasTexture(side),topMap=new T.CanvasTexture(top);
  [map,topMap].forEach(texture=>{texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=4;});
  resources.current={side,top,map,topMap};
  const materialBinding=bindLiveryMaterial(paint,map,topMap);
  binding.current=materialBinding;
  return()=>{materialBinding.dispose();binding.current=null;resources.current=null;map.dispose();topMap.dispose();};
 },[paint]);
 useEffect(()=>{
  const livery=resources.current;if(!livery)return;
  let cancelled=false;
  const military=MILITARY.includes(d.pattern),enabled=d.pattern!=='none';
  const settings={enabled,triplanar:military||d.pattern==='upload',scale:d.scale,opacity:d.opacity,color};
  const apply=()=>{if(cancelled)return;livery.map.needsUpdate=true;livery.topMap.needsUpdate=true;binding.current?.update(settings);invalidate();};
  // Clear the previous design immediately, including while a new image loads.
  binding.current?.update({...settings,enabled:false});
  invalidate();
  if(!enabled)return;
  if(d.pattern==='upload'&&d.image){
   const image=new Image();
   image.onload=()=>{if(cancelled)return;const c=livery.side;c.width=c.height=1024;c.getContext('2d')!.drawImage(image,0,0,1024,1024);apply();};
   image.onerror=()=>{if(!cancelled)onLiveryError?.('Gambar livery tidak dapat dimuat. Pilih ulang desain atau gunakan gambar lain.');};
   image.src=d.image;
   return()=>{cancelled=true;image.onload=null;image.onerror=null;};
  }
  // Keep GPU texture dimensions fixed when moving between 512px camouflage
  // and 1024px race artwork, and always replace every pixel of the old design.
  const side=createCanvas(),top=createCanvas();
  if(military)drawCamouflage(side,d.pattern,d.accent,color);else drawRace(side,d.pattern,color,d.accent);
  drawRace(top,d.pattern,color,d.accent,true);
  livery.side.getContext('2d')!.clearRect(0,0,1024,1024);
  livery.side.getContext('2d')!.drawImage(side,0,0,1024,1024);
  livery.top.getContext('2d')!.clearRect(0,0,1024,1024);
  livery.top.getContext('2d')!.drawImage(top,0,0,1024,1024);
  apply();
  return()=>{cancelled=true;};
 },[paint,d.pattern,d.image,d.accent,d.scale,d.opacity,color,invalidate,onLiveryError]);
 useEffect(()=>{
  const targets=targetCache.current;
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
 },[root,paint,vehicle,d.stickers,invalidate,onPlacement]);
 return null;
}
