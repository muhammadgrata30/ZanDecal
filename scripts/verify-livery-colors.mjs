import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import * as T from 'three';

// Exercise the real material binding with the same cached shader uniforms a
// renderer keeps when a previously selected color/design is selected again.
const output=new URL('../artifacts/studio-qa/studio-livery-material.mjs',import.meta.url);
fs.mkdirSync(new URL('.',output),{recursive:true});
fs.writeFileSync(output,ts.transpileModule(fs.readFileSync(new URL('../lib/studio-livery-material.ts',import.meta.url),'utf8'),{
 compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020},
}).outputText);
const {bindLiveryMaterial}=await import(output.href);
let checked=0;
for(const vehicle of ['ducati','car']){
 const materials=Array.from({length:vehicle==='ducati'?3:1},()=>new T.MeshStandardMaterial({color:'#a18cd1',map:new T.Texture()}));
 const originals=materials.map(m=>({map:m.map,hook:m.onBeforeCompile,cache:m.customProgramCacheKey,color:m.color.clone()}));
 const side=new T.Texture(),top=new T.Texture();
 const binding=bindLiveryMaterial(new Set(materials),side,top);
 const keys=materials.map(m=>m.customProgramCacheKey());
 const versions=materials.map(m=>m.version);
 const shaders=materials.map(material=>{
  const shader={uniforms:{},vertexShader:T.ShaderLib.standard.vertexShader,fragmentShader:T.ShaderLib.standard.fragmentShader};
  material.onBeforeCompile(shader,{});
  assert(shader.fragmentShader.includes('studioOpacity*art.a'),'Transparent uploaded pixels reveal the current base color');
  assert(shader.fragmentShader.includes('#include <map_fragment>'),'Plain paint retains its original material map');
  return shader;
 });
 const bases=shaders.map(shader=>shader.uniforms.studioBase);
 // A -> B -> C -> A repeatedly, across both projection modes and no livery.
 for(let cycle=0;cycle<20;cycle++)for(const color of ['#ff0000','#0000ff','#00ff00','#ff0000'])for(const mode of ['race','military','upload','none']){
  const enabled=mode!=='none',triplanar=mode==='military'||mode==='upload',opacity=cycle%2?0:100;
  binding.update({enabled,triplanar,scale:50+cycle*5,opacity,color});
  materials.forEach((material,index)=>{
   const u=shaders[index].uniforms;
   assert.equal(u.studioBase,bases[index],'Updates must reach the uniforms of an already cached program');
   assert.equal(u.studioBase.value.getHexString(),color.slice(1));
   assert.equal(u.studioEnabled.value,+enabled);
   assert.equal(u.studioTriplanar.value,+triplanar);
   assert.equal(u.studioOpacity.value,opacity/100);
   assert.equal(u.studioScale.value,(50+cycle*5)/100);
   assert.equal(u.studioSide.value,side);assert.equal(u.studioTop.value,top);
   assert.equal(material.map,originals[index].map,'Never overwrite the original paint texture');
   assert.equal(material.color.getHexString(),enabled?'ffffff':color.slice(1));
   assert.equal(material.customProgramCacheKey(),keys[index],'Color changes must not accumulate cached shader programs');
   assert.equal(material.version,versions[index],'Recolor without recompiling the material');
   checked++;
  });
 }
 binding.dispose();
 materials.forEach((material,index)=>{
  assert.equal(material.onBeforeCompile,originals[index].hook);
  assert.equal(material.customProgramCacheKey,originals[index].cache);
  assert(material.color.equals(originals[index].color));
  material.map.dispose();material.dispose();
 });
 side.dispose();top.dispose();
}
console.log(`PASS: ${checked} material updates across Ducati/car, three colors, repeated selections, livery removal, opacity and projection changes; original materials restored on disposal.`);
