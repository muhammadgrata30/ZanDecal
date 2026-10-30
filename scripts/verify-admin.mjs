import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import ts from 'typescript';
import sharp from 'sharp';

const root=fileURLToPath(new URL('../',import.meta.url));
const testDir=await fsp.mkdtemp(path.join(os.tmpdir(),'zan-admin-test-'));
process.env.ZAN_DATA_DIR=testDir;
const nativeRequire=createRequire(import.meta.url),cache=new Map();
function load(filename){
  const full=path.resolve(filename);if(cache.has(full))return cache.get(full).exports;
  const compiled={exports:{}};cache.set(full,compiled);
  const source=fs.readFileSync(full,'utf8');
  const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const require=(name)=>{
    if(name==='server-only')return {};
    if(name.startsWith('.')){const resolved=path.resolve(path.dirname(full),name);if(resolved.endsWith('.json'))return nativeRequire(resolved);return load(resolved+'.ts');}
    return nativeRequire(name);
  };
  new Function('require','module','exports',code)(require,compiled,compiled.exports);return compiled.exports;
}
const sessions=load(path.join(root,'app/api/admin/session/route.ts'));
const content=load(path.join(root,'app/api/content/route.ts'));
const upload=load(path.join(root,'app/api/admin/upload/route.ts'));
const media=load(path.join(root,'app/media/[file]/route.ts'));
const BASE='http://localhost:3000';
let cookie='';
function request(url,method='GET',body,origin=BASE){return new Request(BASE+url,{method,headers:{Origin:origin,...(cookie?{Cookie:cookie}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});}
try{
  assert.equal((await (await sessions.GET(request('/api/admin/session'))).json()).setupRequired,true);
  const seeded=await (await content.GET()).json();
  assert.equal((await content.PUT(request('/api/content','PUT',seeded))).status,401);
  const password='Test-Only-'+crypto.randomUUID();
  const setup=await sessions.POST(request('/api/admin/session','POST',{action:'setup',username:'test-admin',password}));
  assert.equal(setup.status,200);cookie=setup.headers.get('set-cookie').split(';')[0];
  assert.ok(setup.headers.get('set-cookie').includes('HttpOnly'));
  assert.equal((await (await sessions.GET(request('/api/admin/session'))).json()).username,'test-admin');
  assert.equal((await sessions.POST(request('/api/admin/session','POST',{action:'setup',username:'other-admin',password}))).status,409);
  assert.equal((await sessions.POST(request('/api/admin/session','POST',{username:'test-admin',password:'wrong-password'}))).status,401);
  assert.equal((await sessions.POST(request('/api/admin/session','POST',{username:'test-admin',password}))).status,200);
  assert.equal((await content.PUT(request('/api/content','PUT',seeded,'https://untrusted.example'))).status,403);
  const bytes=await sharp({create:{width:12,height:8,channels:4,background:'#a18cd1'}}).png().toBuffer();
  const form=new FormData();form.set('file',new File([bytes],'customer.png',{type:'image/png'}));
  const uploaded=await upload.POST(new Request(BASE+'/api/admin/upload',{method:'POST',headers:{Origin:BASE,Cookie:cookie},body:form}));
  assert.equal(uploaded.status,200);const asset=await uploaded.json();assert.equal(asset.type,'photo');
  const filename=asset.url.split('/').pop();
  const range=await media.GET(new Request(BASE+asset.url,{headers:{Range:'bytes=0-7'}}),{params:Promise.resolve({file:filename})});
  assert.equal(range.status,206);assert.equal(Buffer.from(await range.arrayBuffer()).toString('hex'),'89504e470d0a1a0a');
  const suffix=await media.GET(new Request(BASE+asset.url,{headers:{Range:'bytes=-8'}}),{params:Promise.resolve({file:filename})});assert.equal(suffix.status,206);assert.deepEqual(Buffer.from(await suffix.arrayBuffer()),bytes.subarray(-8));
  const head=await media.HEAD(new Request(BASE+asset.url),{params:Promise.resolve({file:filename})});assert.equal(head.headers.get('Content-Length'),String(bytes.length));
  assert.equal((await media.GET(new Request(BASE+asset.url,{headers:{Range:'bytes=999999-'}}),{params:Promise.resolve({file:filename})})).status,416);
  assert.equal((await media.GET(new Request(BASE+'/media/x'),{params:Promise.resolve({file:'../../admin.json'})})).status,404);
  const fake=new FormData();fake.set('file',new File(['<svg onload="alert(1)"></svg>'],'photo.png',{type:'image/png'}));
  assert.equal((await upload.POST(new Request(BASE+'/api/admin/upload',{method:'POST',headers:{Origin:BASE,Cookie:cookie},body:fake}))).status,400);
  const movie=await fsp.readFile(path.join(root,'public/videos/gallery-showcase-web.mp4'));
  const videoForm=new FormData();videoForm.set('file',new File([movie],'customer.mp4',{type:'video/mp4'}));
  const videoResponse=await upload.POST(new Request(BASE+'/api/admin/upload',{method:'POST',headers:{Origin:BASE,Cookie:cookie},body:videoForm}));
  assert.equal(videoResponse.status,200);const video=await videoResponse.json();assert.equal(video.type,'video');
  const videoStream=await media.GET(new Request(BASE+video.url,{headers:{Range:'bytes=0-31'}}),{params:Promise.resolve({file:video.url.split('/').pop()})});
  assert.equal(videoStream.status,206);assert.equal(videoStream.headers.get('Content-Type'),'video/mp4');assert.deepEqual(Buffer.from(await videoStream.arrayBuffer()),movie.subarray(0,32));
  seeded.materials[0].name='Test changed material';seeded.colors[0].hex='#123ABC';
  seeded.materials.push({...seeded.materials[0],id:'added-material',name:'New customer material'});
  seeded.colors.push({...seeded.colors[0],id:'added-color',name:'New custom color',hex:'#45ABCD'});
  seeded.portfolio.unshift({...seeded.portfolio[0],id:999,title:'Uploaded customer',mediaSrc:asset.url});
  seeded.portfolio.unshift({...seeded.portfolio[0],id:998,title:'Customer video',mediaType:'video',mediaSrc:video.url});
  seeded.showcaseVideo=video.url;
  const saved=await content.PUT(request('/api/content','PUT',seeded));assert.equal(saved.status,200);const published=await saved.json();assert.equal(published.revision,1);
  const publicData=await (await content.GET()).json();assert.equal(publicData.materials[0].name,'Test changed material');assert.equal(publicData.colors[0].hex,'#123ABC');assert.equal(publicData.portfolio.find(v=>v.id===999).mediaSrc,asset.url);assert.equal(publicData.showcaseVideo,video.url);
  assert.equal(publicData.materials.find(v=>v.id==='added-material').name,'New customer material');
  assert.equal(publicData.colors.find(v=>v.id==='added-color').hex,'#45ABCD');
  const disk=JSON.parse(await fsp.readFile(path.join(testDir,'content.json'),'utf8'));assert.equal(disk.revision,1);
  assert.equal((await content.PUT(request('/api/content','PUT',seeded))).status,409);
  const invalid=structuredClone(published);invalid.colors[0].hex='bad';assert.equal((await content.PUT(request('/api/content','PUT',invalid))).status,400);
  const deleted=structuredClone(published);deleted.portfolio=deleted.portfolio.filter(item=>item.id!==999);deleted.colors=deleted.colors.filter(item=>item.id!=='added-color');deleted.materials=deleted.materials.filter(item=>item.id!=='added-material');assert.equal((await content.PUT(request('/api/content','PUT',deleted))).status,200);
  const afterDelete=await (await content.GET()).json();assert.ok(!afterDelete.colors.some(v=>v.id==='added-color'));assert.ok(!afterDelete.materials.some(v=>v.id==='added-material'));assert.ok(!afterDelete.portfolio.some(v=>v.id===999));
  const logout=await sessions.DELETE(request('/api/admin/session','DELETE'));assert.ok(logout.headers.get('set-cookie').includes('Max-Age=0'));cookie='';
  assert.equal((await content.PUT(request('/api/content','PUT',deleted))).status,401);
  console.log('Admin integration passed: setup/login, signed cookie, auth/CSRF, photo/video uploads, media byte ranges, invalid-file rejection, publish/edit/delete, background video, validation, revision conflict and persistence.');
  console.log('Main localhost data and admin account were not changed.');
}finally{
  const resolved=path.resolve(testDir);
  if(path.dirname(resolved)===path.resolve(os.tmpdir())&&path.basename(resolved).startsWith('zan-admin-test-'))await fsp.rm(resolved,{recursive:true,force:true});
}
