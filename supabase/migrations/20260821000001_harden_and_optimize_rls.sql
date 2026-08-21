revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role;

drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists preferences_own on public.user_preferences;
drop policy if exists history_own on public.watch_history;
drop policy if exists continue_own on public.continue_watching;
drop policy if exists watchlist_own on public.watchlist;

create policy profiles_select_own on public.profiles for select using ((select auth.uid()) = id);
create policy profiles_insert_own on public.profiles for insert with check ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy preferences_own on public.user_preferences for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy history_own on public.watch_history for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy continue_own on public.continue_watching for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy watchlist_own on public.watchlist for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
