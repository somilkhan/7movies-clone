create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.watch_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  media_type text not null check (media_type in ('movie','tv','episode')),
  tmdb_id integer not null,
  season_number integer,
  episode_number integer,
  watched_at timestamptz not null default now(),
  progress_seconds integer not null default 0 check (progress_seconds >= 0),
  duration_seconds integer check (duration_seconds is null or duration_seconds > 0),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.continue_watching (
  user_id uuid not null references auth.users(id) on delete cascade,
  media_type text not null check (media_type in ('movie','tv','episode')),
  tmdb_id integer not null,
  season_number integer,
  episode_number integer,
  content_key text not null,
  progress_seconds integer not null default 0 check (progress_seconds >= 0),
  duration_seconds integer check (duration_seconds is null or duration_seconds > 0),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  primary key (user_id, content_key),
  unique (user_id, media_type, tmdb_id, season_number, episode_number)
);

create table if not exists public.watchlist (
  user_id uuid not null references auth.users(id) on delete cascade,
  media_type text not null check (media_type in ('movie','tv')),
  tmdb_id integer not null,
  added_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  primary key (user_id, media_type, tmdb_id)
);

create index if not exists watch_history_user_watched_at_idx on public.watch_history(user_id, watched_at desc);
create index if not exists continue_watching_user_updated_at_idx on public.continue_watching(user_id, updated_at desc);
create index if not exists watchlist_user_added_at_idx on public.watchlist(user_id, added_at desc);

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.watch_history enable row level security;
alter table public.continue_watching enable row level security;
alter table public.watchlist enable row level security;

create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = id);
create policy profiles_update_own on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy preferences_own on public.user_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy history_own on public.watch_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy continue_own on public.continue_watching for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy watchlist_own on public.watchlist for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email))
  on conflict (id) do nothing;
  insert into public.user_preferences (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.continue_watching replica identity full;
alter table public.watchlist replica identity full;
alter table public.user_preferences replica identity full;
alter publication supabase_realtime add table public.continue_watching;
alter publication supabase_realtime add table public.watchlist;
alter publication supabase_realtime add table public.user_preferences;
