-- CHANGE VERSION: HEARTS-CLOUDFLARE-R5 | Read-only export of existing portfolio hearts
-- Run the entire file in the PORTFOLIO project's Supabase SQL Editor.
-- During the final move, run freeze-portfolio-hearts-for-migration.sql FIRST.
-- Download this result as CSV, including its two column headers.
-- Keep the downloaded file private; do not upload it to your public repository.
select visitor_id::text as visitor_id, created_at::text as created_at
from public.portfolio_hearts
order by visitor_id;
-- END OF FILE: HEARTS-CLOUDFLARE-R5 | export-portfolio-hearts.sql
