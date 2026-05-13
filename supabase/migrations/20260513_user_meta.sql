-- =================================================================
-- Migration: user_meta — per-user state for app internals
-- =================================================================
-- Adds a lightweight per-user state table. Currently used to throttle
-- recurring-transaction auto-processing to once per day, so the
-- dashboard load doesn't re-run the expensive backfill on every refresh.
-- =================================================================

create table if not exists public.user_meta (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_recurring_processed_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.user_meta enable row level security;

drop policy if exists "user_meta_select_own" on public.user_meta;
create policy "user_meta_select_own"
  on public.user_meta for select
  using (auth.uid() = user_id);

drop policy if exists "user_meta_insert_own" on public.user_meta;
create policy "user_meta_insert_own"
  on public.user_meta for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_meta_update_own" on public.user_meta;
create policy "user_meta_update_own"
  on public.user_meta for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update updated_at on row update
create or replace function public.touch_user_meta_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_meta_set_updated_at on public.user_meta;
create trigger user_meta_set_updated_at
  before update on public.user_meta
  for each row execute function public.touch_user_meta_updated_at();
