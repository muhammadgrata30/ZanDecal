import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import ts from 'typescript';
import * as T from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
const base=path.resolve(new URL('..',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const files=['components/vehiclePaint.ts','components/experience/vehicleRig.ts','lib/studio-panels.ts','lib/sticker-placement.ts','lib/studio-library.ts'];
for(const file of files){
 const out=path.join(base,'artifacts','studio-qa',file.replace(/\.ts$/,'.mjs'));
 fs.mkdirSync(path.dirname(out),{recursive:true});
 let code=ts.transpileModule(fs.readFileSync(path.join(base,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;
 code=code.replace(/from (["'])(\.[^"']+)\1/g,(_,quote,name)=>`from ${quote}${name}.mjs${quote}`);
 fs.writeFileSync(out,code);
}
const {buildVehicleRig}=await import('../artifacts/studio-qa/components/experience/vehicleRig.mjs');
const {VEHICLE_PANELS}=await import('../artifacts/studio-qa/lib/studio-panels.mjs');
const {stickerTargets,stickerGeometry}=await import('../artifacts/studio-qa/lib/sticker-placement.mjs');
const {STUDIO_LIBRARY}=await import('../artifacts/studio-qa/lib/studio-library.mjs');
let panelCount=0,sampleCount=0,freeCount=0;
const failures=[];
for(const vehicle of ['ducati','car']){
 const file=vehicle==='ducati'?'2024_ducati_streetfighter_v4_s.glb.gz':'byd-seal.glb.gz';
 const bytes=zlib.gunzipSync(fs.readFileSync(path.join(base,'public/models/transport',file)));
 const loader=new GLTFLoader();loader.register(()=>({name:'TEST_TEXTURES',loadTexture:()=>Promise.resolve(new T.Texture())}));
 const {scene}=await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
 const rig=buildVehicleRig(scene,vehicle,new T.Texture());
 const parent=new T.Group();parent.position.x=-6;parent.add(rig.root);parent.updateMatrixWorld(true);
 for(const panel of VEHICLE_PANELS[vehicle]){
  const targets=stickerTargets(rig.root,rig.paint,panel);
  const samples=[[50,50,0,100],[15,15,-30,60],[85,85,30,135],[15,85,45,100],[85,15,-45,100]];
  for(const [x,y,rotation,size]of samples){
   const sticker={id:'test',name:'Test',x,y,size,rotation,side:'Kiri',panel:panel.id};
   const result=stickerGeometry(targets,panel,sticker);
   const count=result?.geometries.reduce((n,g)=>n+g.getAttribute('position').count,0)||0;
   if(!count)failures.push(`${vehicle}/${panel.id} at ${x},${y}`);
   else{
    assert.ok(Math.abs(result.surface.point.x)<3,'Decals must remain in vehicle-local space');
    for(const geometry of result.geometries){assert.ok([...geometry.getAttribute('position').array].every(Number.isFinite));geometry.dispose();}
    if(x===50&&y===50){const free={...sticker,point:result.surface.point.toArray(),normal:result.surface.normal.toArray()};const output=stickerGeometry(targets,panel,free);assert.ok(output?.geometries.length,'Click-to-place geometry must exist');output.geometries.forEach(g=>g.dispose());freeCount++;}
   }
   sampleCount++;
  }
  panelCount++;
 }
 rig.dispose();
}
for(const asset of STUDIO_LIBRARY){if(asset.image){const image=path.join(base,'public',asset.image);assert.ok(fs.existsSync(image),`Missing asset: ${asset.image}`);assert.match(fs.readFileSync(image,'utf8'),/<svg[^>]*xmlns=/);}}
assert.equal(new Set(STUDIO_LIBRARY.map(a=>a.id)).size,STUDIO_LIBRARY.length,'Library IDs must be unique');
assert.equal(failures.length,0,failures.join('\n'));
console.log(`PASS: ${panelCount} panels, ${sampleCount} placement/rotation/size combinations, ${freeCount} custom surface anchors, ${STUDIO_LIBRARY.filter(a=>a.kind==='sticker').length} sticker images.`);
