create table public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  theme text not null default 'light'
    constraint user_preferences_theme_check check (theme in ('light', 'dark'))
);

alter table public.user_preferences enable row level security;

revoke all on table public.user_preferences from anon, authenticated;
grant select, insert, update on table public.user_preferences to authenticated;

create policy "Users can view their own preferences"
on public.user_preferences for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own preferences"
on public.user_preferences for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own preferences"
on public.user_preferences for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
