alter table public.user_preferences
  add column language text not null default 'vi'
  constraint user_preferences_language_check check (language in ('vi', 'en'));

create table public.workspaces (
  id bigint generated always as identity primary key,
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  constraint workspaces_owner_name_unique unique (owner_user_id, name),
  constraint workspaces_name_check check (
    name = btrim(name)
    and char_length(name) between 1 and 48
  )
);

alter table public.workspaces enable row level security;

revoke all on table public.workspaces from anon, authenticated;
grant select, insert on table public.workspaces to authenticated;
grant usage, select on sequence public.workspaces_id_seq to authenticated;

create policy "Users can read their own workspaces"
on public.workspaces
for select
to authenticated
using ((select auth.uid()) = owner_user_id);

create policy "Users can create their own workspaces"
on public.workspaces
for insert
to authenticated
with check ((select auth.uid()) = owner_user_id);
