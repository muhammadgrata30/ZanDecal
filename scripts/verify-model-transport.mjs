import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {createServer} from "node:http";
import {gunzipSync} from "node:zlib";
import ts from "typescript";
import * as THREE from "three";
import * as fflate from "three/examples/jsm/libs/fflate.module.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";

async function load(relative,dependencies){
  const source=await readFile(new URL(relative,import.meta.url),"utf8");
  const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  const exports={};new Function("require","exports",output)(name=>{assert.ok(name in dependencies,name);return dependencies[name];},exports);return exports;
}
const {decodeModelBytes}=await load("../lib/model-transport.ts",{"three/examples/jsm/libs/fflate.module.js":fflate});
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
const {PortableModelLoader}=await load("../components/experience/PortableModelLoader.ts",{three:THREE,"three/examples/jsm/loaders/GLTFLoader.js":{GLTFLoader},"../../lib/model-transport":{decodeModelBytes}});
const server=createServer((request,response)=>{response.writeHead(200,{"Content-Type":"application/gzip"});response.end(archive);});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
try{
  const result=await new PortableModelLoader().loadAsync(`http://127.0.0.1:${server.address().port}/motor.glb.gz`);
  let meshes=0;result.scene.traverse(node=>{if(node.isMesh)meshes++;});assert.ok(meshes>0);
  console.log(`PASS ${asset}: raw gzip, decoded GLB, older-browser fallback and invalid responses; real loader parsed ${meshes} meshes without Content-Encoding.`);
}finally{await new Promise(resolve=>server.close(resolve));}
}
