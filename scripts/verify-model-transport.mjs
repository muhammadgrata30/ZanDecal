import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createServer} from "node:http";
import {gunzipSync} from "node:zlib";
import ts from "typescript";
import * as THREE from "three";
import * as fflate from "three/examples/jsm/libs/fflate.module.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {installImageDOM} from './studio-image-test-dom.mjs';

async function load(relative,dependencies){
  const source=await readFile(new URL(relative,import.meta.url),"utf8");
  const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  const exports={};new Function("require","exports",output)(name=>{assert.ok(name in dependencies,name);return dependencies[name];},exports);return exports;
}
const {decodeModelBytes}=await load("../lib/model-transport.ts",{"three/examples/jsm/libs/fflate.module.js":fflate});
const {StudioTextureLoader}=await load('../components/experience/StudioTextureLoader.ts',{three:THREE});
const imageDOM=installImageDOM();
for(const asset of ["2024_ducati_streetfighter_v4_s","byd-seal"]){
const archive=await readFile(new URL(`../public/models/transport/${asset}.glb.gz`,import.meta.url));
const original=gunzipSync(archive);
const buffer=bytes=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
assert.deepEqual(Buffer.from(await decodeModelBytes(buffer(archive))),original,"Raw gzip, as served by Netlify, preserves every model byte");
assert.deepEqual(Buffer.from(await decodeModelBytes(buffer(original))),original,"Already decoded HTTP response is not decompressed twice");
const native=globalThis.DecompressionStream;
try{globalThis.DecompressionStream=undefined;assert.deepEqual(Buffer.from(await decodeModelBytes(buffer(archive))),original,"Older-browser fallback preserves every model byte");}finally{globalThis.DecompressionStream=native;}
await assert.rejects(decodeModelBytes(buffer(Buffer.from("<html>Not found</html>"))),/bukan GLB/);

// Exercise the real FileLoader -> decompression -> GLTF parser boundary against Netlify's response shape.
globalThis.self=globalThis;
globalThis.createImageBitmap=async()=>({width:1,height:1,close(){}});
globalThis.ProgressEvent??=class{constructor(type,options){this.type=type;Object.assign(this,options);}};
const {PortableModelLoader}=await load("../components/experience/PortableModelLoader.ts",{three:THREE,"three/examples/jsm/loaders/GLTFLoader.js":{GLTFLoader},"../../lib/model-transport":{decodeModelBytes},'./StudioTextureLoader':{StudioTextureLoader}});
const server=createServer((request,response)=>{response.writeHead(200,{"Content-Type":"application/gzip"});response.end(archive);});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
try{
  const result=await new PortableModelLoader().loadAsync(`http://127.0.0.1:${server.address().port}/motor.glb.gz`);
  let meshes=0;result.scene.traverse(node=>{if(node.isMesh)meshes++;});assert.ok(meshes>0);
  const textures=await result.parser.getDependencies('texture');
  assert.ok(textures.every(texture=>texture&&Math.max(texture.image.width,texture.image.height)<=512),'Every embedded texture decodes and stays within the studio budget');
  console.log(`PASS ${asset}: raw gzip, decoded GLB, older-browser fallback and invalid responses; real loader parsed ${meshes} meshes without Content-Encoding.`);
}finally{await new Promise(resolve=>server.close(resolve));}
}
assert.equal(imageDOM.stats.images,48,'All 48 embedded images were decoded, not replaced by blank textures');
assert(imageDOM.stats.peak<=2,'At most two images decode concurrently across models');
console.log(`PASS: ${imageDOM.stats.images} real PNG/JPEG decodes; peak concurrency ${imageDOM.stats.peak}; all studio textures <=512px.`);
// A failed image must release its queue slot and its temporary object URL.
const invalid=URL.createObjectURL(new Blob(['not an image'],{type:'image/png'}));
const valid=URL.createObjectURL(new Blob([await readFile(new URL('../public/models/ducati-paint-neutral.png',import.meta.url))],{type:'image/png'}));
const loader=new StudioTextureLoader();
const results=await Promise.allSettled([loader.loadAsync(invalid),loader.loadAsync(valid),loader.loadAsync(valid)]);
assert.equal(results[0].status,'rejected');
assert(results.slice(1).every(result=>result.status==='fulfilled'),'Queued images continue after a failed decode');
await assert.rejects(fetch(invalid),'Failed blob URLs are revoked');
URL.revokeObjectURL(valid);
for(const result of results)if(result.status==='fulfilled')result.value.dispose();
assert.equal(imageDOM.stats.decoding,0);
assert(imageDOM.stats.peak<=2);
console.log('PASS: failed decode releases the queue and revokes its blob URL; subsequent images still load.');
imageDOM.restore();
