-- CHANGE VERSION: HEARTS-PAGES-R1 | 2026-10-20 | Shared no-login portfolio hearts
-- Run this entire file in your own Supabase project's SQL Editor.
-- It is safe to run again: existing hearts are retained.
-- Browser clients get only the total and their own random browser-ID state.
-- Clearing browser storage or using another browser creates another identity;
-- this is a lightweight appreciation counter, not authenticated voting.

begin;

create table if not exists public.portfolio_hearts (
  visitor_id uuid primary key,
  created_at timestamptz not null default now()
);

alter table public.portfolio_hearts enable row level security;
revoke all on table public.portfolio_hearts from public, anon, authenticated;

create or replace function public.portfolio_heart_state(p_visitor_id uuid)
returns table (liked boolean, count bigint)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_visitor_id is null then
    raise exception 'A browser identifier is required.' using errcode = '22023';
  end if;
  return query
    select exists (
      select 1 from public.portfolio_hearts h where h.visitor_id = p_visitor_id
    ), (
      select pg_catalog.count(*) from public.portfolio_hearts
    );
end;
$$;

create or replace function public.set_portfolio_heart(p_visitor_id uuid, p_liked boolean)
returns table (liked boolean, count bigint)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_visitor_id is null or p_liked is null then
    raise exception 'A browser identifier and heart state are required.' using errcode = '22023';
  end if;

  -- Serialize repeated requests from this browser. Setting true twice adds one
  -- heart, and setting false twice removes at most that browser's own heart.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_visitor_id::text, 731204));
  if p_liked then
    insert into public.portfolio_hearts (visitor_id) values (p_visitor_id)
    on conflict (visitor_id) do nothing;
  else
    delete from public.portfolio_hearts h where h.visitor_id = p_visitor_id;
  end if;

  return query
    select s.liked, s.count from public.portfolio_heart_state(p_visitor_id) s;
end;
$$;

revoke all on function public.portfolio_heart_state(uuid) from public;
revoke all on function public.set_portfolio_heart(uuid, boolean) from public;
grant execute on function public.portfolio_heart_state(uuid) to anon, authenticated;
grant execute on function public.set_portfolio_heart(uuid, boolean) to anon, authenticated;

-- Ask the Data API to pick up the newly created RPC endpoints.
notify pgrst, 'reload schema';
commit;
-- END OF FILE: HEARTS-PAGES-R1 | portfolio-hearts.sql
