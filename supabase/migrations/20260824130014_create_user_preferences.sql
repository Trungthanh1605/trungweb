create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.user_preferences
  add column if not exists theme text not null default 'light';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_preferences_theme_check'
      and conrelid = 'public.user_preferences'::regclass
  ) then
    alter table public.user_preferences
      add constraint user_preferences_theme_check
      check (theme in ('light', 'dark'));
  end if;
end $$;

alter table public.user_preferences enable row level security;

revoke all on table public.user_preferences from anon, authenticated;
grant select, insert, update on table public.user_preferences to authenticated;

drop policy if exists "Users can view their own preferences"
on public.user_preferences;
create policy "Users can view their own preferences"
on public.user_preferences for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own preferences"
on public.user_preferences;
create policy "Users can create their own preferences"
on public.user_preferences for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own preferences"
on public.user_preferences;
create policy "Users can update their own preferences"
on public.user_preferences for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
