-- 内容门户升级：同一套后台同时管理图文与视频。
-- 旧内容自动按图文处理，不影响已经发布的文章。

alter table public.articles
  add column if not exists content_type text not null default 'article';

alter table public.articles
  add column if not exists video_url text;

alter table public.articles
  add column if not exists preview_content text;

alter table public.articles
  add column if not exists duration_text text;

alter table public.articles
  add column if not exists is_featured boolean not null default false;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'articles_content_type_check'
  ) then
    alter table public.articles
      add constraint articles_content_type_check
      check (content_type in ('article', 'video'));
  end if;
end
$$;

create index if not exists articles_content_type_published_idx
  on public.articles(content_type, status, published_at desc);
