-- CHANGE VERSION: HEARTS-CLOUDFLARE-R5 | Cancel a pending heart migration
-- Run ONLY in the original gbppimentel-dev Supabase project if cancelling cutover.
-- This restores the existing heart write RPC; no heart records are removed.

begin;
lock table public.portfolio_hearts in access exclusive mode;
drop trigger if exists portfolio_hearts_migration_write_guard on public.portfolio_hearts;
drop function if exists public.portfolio_hearts_migration_write_guard();
grant execute on function public.set_portfolio_heart(uuid, boolean) to anon, authenticated;
notify pgrst, 'reload schema';
commit;
-- END OF FILE: HEARTS-CLOUDFLARE-R5
