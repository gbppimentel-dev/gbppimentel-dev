-- CHANGE VERSION: HEARTS-CLOUDFLARE-R5 | Final snapshot write freeze
-- Run ONLY in the gbppimentel-dev Supabase project when Cloudflare setup is ready.
-- Existing hearts and the read RPC are retained. Adds/removes are temporarily blocked.
-- After this completes, run export-portfolio-hearts.sql and download its CSV result.
-- To cancel the migration, run unfreeze-portfolio-hearts.sql in this same project.

begin;
lock table public.portfolio_hearts in access exclusive mode;

create or replace function public.portfolio_hearts_migration_write_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Heart storage is moving. Please try again shortly.'
    using errcode = '55000';
end;
$$;

drop trigger if exists portfolio_hearts_migration_write_guard on public.portfolio_hearts;
create trigger portfolio_hearts_migration_write_guard
before insert or update or delete on public.portfolio_hearts
for each statement execute function public.portfolio_hearts_migration_write_guard();

revoke execute on function public.set_portfolio_heart(uuid, boolean) from anon, authenticated;
notify pgrst, 'reload schema';
commit;
-- END OF FILE: HEARTS-CLOUDFLARE-R5
