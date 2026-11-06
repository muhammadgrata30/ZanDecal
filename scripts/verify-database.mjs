import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const db=await PGlite.create();
try{
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
    create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);`);
  await db.exec(await fs.readFile(new URL('../supabase/migrations/001_zan_decal.sql',import.meta.url),'utf8'));
  const seed=JSON.parse(await fs.readFile(new URL('../lib/content-defaults.json',import.meta.url),'utf8'));
  await db.exec('set role service_role');
  assert.equal((await db.query('select public.zan_read_content() as content')).rows[0].content,null);
  const publish=content=>db.query('select public.zan_publish_content($1,$2::jsonb) as content',[content.revision,JSON.stringify(content)]);
  const saved=(await publish(seed)).rows[0].content;
  assert.equal(saved.revision,1);assert.equal(saved.materials.length,3);assert.equal(saved.colors.length,12);
  await assert.rejects(()=>publish(seed),error=>error.code==='40001');
  const updated=structuredClone(saved);updated.materials.push({...updated.materials[0],id:'test-material',name:'Admin added material'});updated.colors.push({...updated.colors[0],id:'test-color',hex:'#123456'});
  const next=(await publish(updated)).rows[0].content;assert.equal(next.revision,2);assert.equal(next.colors.at(-1).hex,'#123456');
  const broken=structuredClone(next);broken.colors.push(broken.colors[0]);
  await assert.rejects(()=>publish(broken),error=>error.code==='23505');
  const afterRollback=(await db.query('select public.zan_read_content() as content')).rows[0].content;
  assert.deepEqual(afterRollback,next,'A failed publish rolls back every table, including deletions');
  const admin={username:'test-admin',passwordHash:'test-hash',salt:'test-salt',secret:'test-secret'};
  assert.equal((await db.query('select public.zan_create_admin($1::jsonb) as created',[JSON.stringify(admin)])).rows[0].created,true);
  assert.equal((await db.query('select public.zan_create_admin($1::jsonb) as created',[JSON.stringify(admin)])).rows[0].created,false);
  await db.exec('reset role;set role anon');
  await assert.rejects(()=>db.query('select account from public.zan_admin'),error=>error.code==='42501');
  await assert.rejects(()=>db.query('select public.zan_read_content()'),error=>error.code==='42501');
  await db.exec('reset role;set role authenticated');
  await assert.rejects(()=>db.query('select account from public.zan_admin'),error=>error.code==='42501');
  await assert.rejects(()=>db.query('select public.zan_create_admin($1::jsonb)',[JSON.stringify(admin)]),error=>error.code==='42501');
  await db.exec('reset role');
  await db.exec(await fs.readFile(new URL('../supabase/migrations/001_zan_decal.sql',import.meta.url),'utf8'));
  assert.equal((await db.query('select revision from public.zan_site_state')).rows[0].revision,2,'Re-running the migration preserves content');
  console.log('PostgreSQL schema passed: tables, first publish, additions, conflict detection, transaction rollback, single admin, RLS/grants and idempotent migration.');
}finally{await db.close();}
