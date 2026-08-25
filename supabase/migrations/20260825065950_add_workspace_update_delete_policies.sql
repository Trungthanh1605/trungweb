grant update, delete on table public.workspaces to authenticated;

create policy "Users can update their own workspaces"
on public.workspaces
for update
to authenticated
using ((select auth.uid()) = owner_user_id)
with check ((select auth.uid()) = owner_user_id);

create policy "Users can delete their own workspaces"
on public.workspaces
for delete
to authenticated
using ((select auth.uid()) = owner_user_id);
