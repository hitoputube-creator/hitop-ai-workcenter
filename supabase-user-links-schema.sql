create table if not exists public.user_links (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('other', 'gov')),
  name text not null,
  url text not null,
  "desc" text,
  new_tab boolean not null default true,
  icon text,
  sort_order integer not null default 0,
  source_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_links_category_source_id_key unique (category, source_id)
);

create index if not exists user_links_category_active_sort_idx
  on public.user_links (category, is_active, sort_order, created_at);

create or replace function public.set_user_links_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_links_updated_at on public.user_links;
create trigger set_user_links_updated_at
  before update on public.user_links
  for each row
  execute function public.set_user_links_updated_at();

grant select, insert, update, delete on public.user_links to anon, authenticated;

alter table public.user_links enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_links'
      and policyname = 'Public can read user links'
  ) then
    create policy "Public can read user links"
      on public.user_links
      for select
      to anon, authenticated
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_links'
      and policyname = 'Public can insert user links'
  ) then
    create policy "Public can insert user links"
      on public.user_links
      for insert
      to anon, authenticated
      with check (category in ('other', 'gov'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_links'
      and policyname = 'Public can update user links'
  ) then
    create policy "Public can update user links"
      on public.user_links
      for update
      to anon, authenticated
      using (true)
      with check (category in ('other', 'gov'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_links'
      and policyname = 'Public can delete user links'
  ) then
    create policy "Public can delete user links"
      on public.user_links
      for delete
      to anon, authenticated
      using (true);
  end if;
end;
$$;
