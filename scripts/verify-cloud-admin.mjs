import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import ts from 'typescript';
import sharp from 'sharp';

const root=fileURLToPath(new URL('../',import.meta.url)),nativeRequire=createRequire(import.meta.url),cache=new Map();
const db=await PGlite.create(),originalFetch=globalThis.fetch;
const envKeys=['SUPABASE_URL','SUPABASE_SECRET_KEY','SUPABASE_SERVICE_ROLE_KEY','NETLIFY','ADMIN_SETUP_TOKEN'];
const previousEnv=Object.fromEntries(envKeys.map(key=>[key,process.env[key]]));
process.env.SUPABASE_URL='https://zan-database.example';process.env.SUPABASE_SECRET_KEY=crypto.randomUUID();delete process.env.SUPABASE_SERVICE_ROLE_KEY;
process.env.NETLIFY='true';process.env.ADMIN_SETUP_TOKEN=crypto.randomUUID();
function load(file){const full=path.resolve(file);if(cache.has(full))return cache.get(full).exports;const compiled={exports:{}};cache.set(full,compiled);const code=ts.transpileModule(fs.readFileSync(full,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;const require=name=>name==='server-only'?{}:name.startsWith('.')?(name.endsWith('.json')?nativeRequire(path.resolve(path.dirname(full),name)):load(path.resolve(path.dirname(full),name)+'.ts')):nativeRequire(name);new Function('require','module','exports',code)(require,compiled,compiled.exports);return compiled.exports;}
const objects=new Map();
try{
  await db.exec('create role anon;create role authenticated;create role service_role bypassrls;create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);');
  await db.exec(await fsp.readFile(path.join(root,'supabase/migrations/001_zan_decal.sql'),'utf8'));
  globalThis.fetch=async(input,init={})=>{
    const url=new URL(typeof input==='string'?input:input.url);const headers=new Headers(init.headers);const method=init.method||'GET';
    assert.equal(url.origin,process.env.SUPABASE_URL);
    const key=url.pathname.split('/').pop();
    if(url.pathname.startsWith('/storage/v1/object/upload/sign/')){
      if(method==='POST'){assert.equal(headers.get('apikey'),process.env.SUPABASE_SECRET_KEY);return Response.json({url:`/object/upload/sign/zan-media/${key}?token=test-ticket`});}
      assert.equal(method,'PUT');assert.equal(url.searchParams.get('token'),'test-ticket');assert.ok(!headers.has('apikey'),'Browser never receives service credentials');objects.set(key,Buffer.from(await init.body.arrayBuffer()));return Response.json({Key:key});
    }
    if(url.pathname.startsWith('/storage/v1/object/info/')){assert.equal(headers.get('apikey'),process.env.SUPABASE_SECRET_KEY);return objects.has(key)?Response.json({metadata:{size:objects.get(key).length}}):Response.json({error:'missing'},{status:404});}
    if(url.pathname.startsWith('/storage/v1/object/public/'))return new Response(objects.get(key)?.subarray(0,32)||null,{status:objects.has(key)?206:404});
    assert.equal(headers.get('apikey'),process.env.SUPABASE_SECRET_KEY);
    try{
      if(url.pathname==='/rest/v1/zan_admin')return Response.json((await db.query('select account from public.zan_admin where singleton=true')).rows);
      const body=JSON.parse(init.body||'{}');let result;
      if(key==='zan_read_content')result=await db.query('select public.zan_read_content() as result');
      else if(key==='zan_create_admin')result=await db.query('select public.zan_create_admin($1::jsonb) as result',[JSON.stringify(body.p_account)]);
      else if(key==='zan_publish_content')result=await db.query('select public.zan_publish_content($1,$2::jsonb) as result',[body.p_expected_revision,JSON.stringify(body.p_content)]);
      else throw Error('Unexpected RPC '+key);
      return Response.json(result.rows[0].result);
    }catch(error){return Response.json({code:error.code},{status:409});}
  };
  const sessions=load(path.join(root,'app/api/admin/session/route.ts')),content=load(path.join(root,'app/api/content/route.ts')),upload=load(path.join(root,'app/api/admin/upload/route.ts')),media=load(path.join(root,'app/media/[file]/route.ts'));
  let cookie='';const base='https://zan-test.netlify.app';process.env.ZAN_SITE_URL=base;
  const req=(method='GET',body)=>new Request(base+'/api/admin',{method,headers:{Origin:base,...(cookie?{Cookie:cookie}:{}),...(body?{'Content-Type':'application/json'}:{}),'X-Setup-Token':process.env.ADMIN_SETUP_TOKEN},...(body?{body:JSON.stringify(body)}:{})});
  assert.equal((await (await sessions.GET(req())).json()).storage,'cloud');
  assert.equal((await upload.GET(req())).status,401);
  const created=await sessions.POST(req('POST',{action:'setup',username:'cloud-admin',password:'Test-only-'+crypto.randomUUID()}));assert.equal(created.status,200);cookie=created.headers.get('set-cookie').split(';')[0];
  const info=await (await sessions.GET(req())).json();assert.equal(info.role,'admin');assert.equal(info.username,'cloud-admin');
  const seed=await (await content.GET()).json();
  const bytes=await sharp({create:{width:12,height:8,channels:4,background:'#a18cd1'}}).png().toBuffer();
  assert.equal((await (await upload.GET(req())).json()).mode,'direct');
  const start=await upload.POST(req('POST',{action:'prepare',name:'customer.png',size:bytes.length,prefix:bytes.subarray(0,32).toString('base64')}));assert.equal(start.status,200);const prepared=await start.json();
  assert.ok(!JSON.stringify(prepared).includes(process.env.SUPABASE_SECRET_KEY));
  await fetch(prepared.uploadUrl,{method:'PUT',headers:{'Content-Type':prepared.mime},body:new File([bytes],'customer.png')});
  const complete=await upload.POST(req('POST',{action:'complete',ticket:prepared.ticket}));assert.equal(complete.status,200);const uploaded=await complete.json();
  assert.equal((await upload.POST(req('POST',{action:'complete',ticket:prepared.ticket+'tampered'}))).status,400);
  seed.materials[0].name='Published cloud material';seed.colors.push({...seed.colors[0],id:'cloud-color',name:'Cloud color',hex:'#123ABC'});seed.portfolio.unshift({...seed.portfolio[0],id:900,mediaSrc:uploaded.url,title:'Cloud upload'});
  const saved=await content.PUT(req('PUT',seed));assert.equal(saved.status,200);const published=await saved.json();assert.equal(published.revision,1);
  assert.equal((await content.PUT(req('PUT',seed))).status,409);
  const fresh=(await (await content.GET()).json());assert.equal(fresh.portfolio[0].mediaSrc,uploaded.url);assert.equal(fresh.colors.at(-1).name,'Cloud color');
  const redirected=await media.GET(new Request(base+uploaded.url),{params:Promise.resolve({file:uploaded.url.split('/').pop()})});assert.equal(redirected.status,307);assert.ok(redirected.headers.get('Location').includes('/storage/v1/object/public/zan-media/'));
  const account=(await db.query('select account from public.zan_admin')).rows[0].account;assert.ok(account.passwordHash);assert.ok(!account.password);
  console.log('Cloud admin contract passed against real PostgreSQL: setup, role/cookie, signed direct upload and verification, tampered ticket rejection, atomic publish/conflict, public content and CDN redirect.');
}finally{globalThis.fetch=originalFetch;for(const key of envKeys){if(previousEnv[key]===undefined)delete process.env[key];else process.env[key]=previousEnv[key];}await db.close();}
