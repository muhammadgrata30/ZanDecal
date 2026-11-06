-- Run once in the Supabase SQL editor. Safe to run again; no content is reset.
begin;
create table if not exists public.zan_site_state (
  singleton boolean primary key default true check (singleton),
  revision bigint not null default 0 check(revision>=0),
  showcase_video text not null default '', showcase_poster text not null default '',
  updated_at timestamptz not null default now()
);
create table if not exists public.zan_materials (id text primary key, position integer not null, data jsonb not null);
create table if not exists public.zan_portfolio (id bigint primary key, position integer not null, data jsonb not null);
create table if not exists public.zan_colors (id text primary key, position integer not null, data jsonb not null);
create table if not exists public.zan_admin (
  singleton boolean primary key default true check(singleton),
  account jsonb not null check(jsonb_typeof(account)='object'), created_at timestamptz not null default now()
);
alter table public.zan_site_state enable row level security;
alter table public.zan_materials enable row level security;
alter table public.zan_portfolio enable row level security;
alter table public.zan_colors enable row level security;
alter table public.zan_admin enable row level security;
revoke all on public.zan_site_state,public.zan_materials,public.zan_portfolio,public.zan_colors,public.zan_admin from public,anon,authenticated;
grant all on public.zan_site_state,public.zan_materials,public.zan_portfolio,public.zan_colors,public.zan_admin to service_role;

create or replace function public.zan_read_content() returns jsonb language sql stable security invoker set search_path='' as $$
  select jsonb_build_object('revision',s.revision,'showcaseVideo',s.showcase_video,'showcasePoster',s.showcase_poster,
    'materials',coalesce((select jsonb_agg(m.data order by m.position) from public.zan_materials m),'[]'::jsonb),
    'portfolio',coalesce((select jsonb_agg(p.data order by p.position) from public.zan_portfolio p),'[]'::jsonb),
    'colors',coalesce((select jsonb_agg(c.data order by c.position) from public.zan_colors c),'[]'::jsonb))
  from public.zan_site_state s where s.singleton=true;
$$;

create or replace function public.zan_publish_content(p_expected_revision bigint,p_content jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare current_revision bigint;
begin
  if jsonb_typeof(p_content->'materials') is distinct from 'array' or jsonb_typeof(p_content->'portfolio') is distinct from 'array'
    or jsonb_typeof(p_content->'colors') is distinct from 'array' then raise exception 'Invalid content arrays' using errcode='22023'; end if;
  if jsonb_array_length(p_content->'colors')<1 then raise exception 'At least one color required' using errcode='22023'; end if;
  insert into public.zan_site_state(singleton) values(true) on conflict do nothing;
  select revision into current_revision from public.zan_site_state where singleton=true for update;
  if current_revision<>p_expected_revision then raise exception 'Content revision conflict' using errcode='40001'; end if;
  delete from public.zan_materials;
  insert into public.zan_materials(id,position,data) select item->>'id',ordinality::integer,item from jsonb_array_elements(p_content->'materials') with ordinality as entries(item,ordinality);
  delete from public.zan_portfolio;
  insert into public.zan_portfolio(id,position,data) select (item->>'id')::bigint,ordinality::integer,item from jsonb_array_elements(p_content->'portfolio') with ordinality as entries(item,ordinality);
  delete from public.zan_colors;
  insert into public.zan_colors(id,position,data) select item->>'id',ordinality::integer,item from jsonb_array_elements(p_content->'colors') with ordinality as entries(item,ordinality);
  update public.zan_site_state set revision=current_revision+1,showcase_video=coalesce(p_content->>'showcaseVideo',''),showcase_poster=coalesce(p_content->>'showcasePoster',''),updated_at=now() where singleton=true;
  return public.zan_read_content();
end;
$$;

create or replace function public.zan_create_admin(p_account jsonb) returns boolean language plpgsql security invoker set search_path='' as $$
declare inserted boolean;
begin
  if jsonb_typeof(p_account) is distinct from 'object' or coalesce(p_account->>'username','')='' or coalesce(p_account->>'passwordHash','')='' or coalesce(p_account->>'salt','')='' or coalesce(p_account->>'secret','')='' then raise exception 'Invalid admin account' using errcode='22023'; end if;
  insert into public.zan_admin(singleton,account) values(true,p_account) on conflict do nothing returning singleton into inserted;
  return coalesce(inserted,false);
end;
$$;
revoke all on function public.zan_read_content(),public.zan_publish_content(bigint,jsonb),public.zan_create_admin(jsonb) from public,anon,authenticated;
grant execute on function public.zan_read_content(),public.zan_publish_content(bigint,jsonb),public.zan_create_admin(jsonb) to service_role;

-- Only the server can authorize writes. Published photos/videos are public assets.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('zan-media','zan-media',true,52428800,array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'])
on conflict(id) do nothing;
commit;
