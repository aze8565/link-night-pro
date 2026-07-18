-- 霖K海外夜娱地图：数据库、权限、会员和文章系统
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'user' check (role in ('user','editor','admin')),
  plan text not null default 'free' check (plan in ('free','regional','global')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  country text not null,
  city text not null,
  cover_url text,
  access_level text not null default 'free' check (access_level in ('free','regional','global')),
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_published_idx on public.articles(status,published_at desc);
create index if not exists articles_destination_idx on public.articles(country,city);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','regional','global')),
  status text not null default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists touch_articles_updated_at on public.articles;
create trigger touch_articles_updated_at
before update on public.articles
for each row execute function public.touch_updated_at();

drop trigger if exists touch_memberships_updated_at on public.memberships;
create trigger touch_memberships_updated_at
before update on public.memberships
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  insert into public.memberships (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.memberships enable row level security;

create or replace function public.has_role(roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = any(roles)
  );
$$;

create policy "profiles_select_own_or_admin" on public.profiles
for select using (id = auth.uid() or public.has_role(array['admin']));

create policy "profiles_update_own" on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

create policy "articles_select_published" on public.articles
for select using (status = 'published' or public.has_role(array['editor','admin']));

create policy "articles_manage_editor_admin" on public.articles
for all using (public.has_role(array['editor','admin'])) with check (public.has_role(array['editor','admin']));

create policy "memberships_select_own_or_admin" on public.memberships
for select using (user_id = auth.uid() or public.has_role(array['admin']));

create policy "memberships_manage_admin" on public.memberships
for all using (public.has_role(array['admin'])) with check (public.has_role(array['admin']));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cover-images', 'cover-images', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

create policy "cover_images_public_read" on storage.objects
for select using (bucket_id = 'cover-images');

create policy "cover_images_editor_upload" on storage.objects
for insert with check (bucket_id = 'cover-images' and public.has_role(array['editor','admin']));

create policy "cover_images_editor_update" on storage.objects
for update using (bucket_id = 'cover-images' and public.has_role(array['editor','admin']));

create policy "cover_images_editor_delete" on storage.objects
for delete using (bucket_id = 'cover-images' and public.has_role(array['editor','admin']));
