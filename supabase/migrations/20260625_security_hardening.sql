-- =================================================================
-- Migration: Security hardening (Supabase advisor follow-up)
-- =================================================================
-- Addresses non-critical WARN findings surfaced after the #22 RLS
-- verification. No data is modified; user-to-user isolation is already
-- proven and unchanged by this migration.
--
--  1) storage: stop anonymous enumeration/listing of goal-images
--  2) functions: pin search_path (anti-injection) on trigger/helper fns
--  3) functions: revoke RPC executability of SECURITY DEFINER fns
-- =================================================================

-- -----------------------------------------------------------------
-- 1) Storage — restrict goal-images SELECT to the owning user.
--    Public image loading is UNAFFECTED: the app uses the public
--    object URL (/object/public/...) which a public bucket serves
--    without consulting these RLS policies. This policy only governs
--    the authenticated Storage API (list/select), so scoping it to the
--    owner stops cross-user enumeration of file names.
-- -----------------------------------------------------------------
drop policy if exists "Anyone can view goal images" on storage.objects;
drop policy if exists "Users can view own goal images" on storage.objects;

create policy "Users can view own goal images"
  on storage.objects for select to public
  using (
    bucket_id = 'goal-images'
    and (storage.foldername(name))[1] = (auth.uid())::text
  );

-- -----------------------------------------------------------------
-- 2) Pin search_path on helper/trigger functions.
--    recompute_goal_current_amount + trg_sync_goal_amount are
--    recreated with schema-qualified references and an empty
--    search_path. trg_sync_goal_amount additionally becomes
--    SECURITY DEFINER so it can still invoke the (now non-public)
--    recompute function from within the trigger.
-- -----------------------------------------------------------------
create or replace function public.recompute_goal_current_amount(p_goal_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.goals
  set current_amount = coalesce((
    select sum(amount) from public.transactions
    where goal_id = p_goal_id and type = 'savings_deposit'
  ), 0)
  where id = p_goal_id;
end;
$$;

create or replace function public.trg_sync_goal_amount()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if TG_OP = 'INSERT' and NEW.goal_id is not null then
    perform public.recompute_goal_current_amount(NEW.goal_id);
  elsif TG_OP = 'UPDATE' then
    if OLD.goal_id is not null then
      perform public.recompute_goal_current_amount(OLD.goal_id);
    end if;
    if NEW.goal_id is not null and NEW.goal_id is distinct from OLD.goal_id then
      perform public.recompute_goal_current_amount(NEW.goal_id);
    end if;
  elsif TG_OP = 'DELETE' and OLD.goal_id is not null then
    perform public.recompute_goal_current_amount(OLD.goal_id);
  end if;
  return coalesce(NEW, OLD);
end;
$$;

-- updated_at touch triggers only call now() (pg_catalog, implicit) → empty path is safe
alter function public.touch_portfolio_accounts_updated_at() set search_path = '';
alter function public.touch_user_meta_updated_at() set search_path = '';

-- -----------------------------------------------------------------
-- 3) Revoke RPC executability of SECURITY DEFINER functions.
--    Triggers (recompute via SECURITY DEFINER trg) and the DDL event
--    trigger (rls_auto_enable) keep working; only direct PostgREST RPC
--    calls by anon/authenticated are blocked.
-- -----------------------------------------------------------------
revoke execute on function public.recompute_goal_current_amount(uuid) from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
-- trg_sync_goal_amount is a trigger fn made SECURITY DEFINER above; triggers fire
-- without an EXECUTE grant, so revoke its (default) public RPC executability too.
revoke execute on function public.trg_sync_goal_amount() from public, anon, authenticated;
