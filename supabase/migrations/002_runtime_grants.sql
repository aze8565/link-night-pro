-- Runtime privileges for Supabase API roles.
-- RLS policies remain the source of row-level authorization.

grant usage on schema public to anon, authenticated;

grant select on table public.articles to anon;
grant select, insert, update, delete on table public.articles to authenticated;

grant select on table public.profiles to authenticated;
grant select, insert, update, delete on table public.memberships to authenticated;

grant execute on function public.has_role(text[]) to anon, authenticated;
