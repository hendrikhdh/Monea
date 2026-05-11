-- =================================================================
-- Migration: Portfolio Accounts + Monthly Balance Snapshots
-- =================================================================
-- Adds two tables to support the new Portfolio detail page:
--  - portfolio_accounts: manually-tracked accounts (Tagesgeld, Depot, Cash...)
--  - monthly_balance_snapshots: frozen monthly balances for past months,
--    overriding the auto-calculated value from transactions
-- =================================================================

-- =================================================================
-- portfolio_accounts
-- =================================================================
create table if not exists public.portfolio_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('savings', 'brokerage', 'cash', 'other')),
  current_amount numeric(14, 2) not null default 0,
  icon text not null default 'Wallet',
  color text not null default '#56423b',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_accounts_user_idx
  on public.portfolio_accounts(user_id);

alter table public.portfolio_accounts enable row level security;

drop policy if exists "portfolio_accounts_select_own" on public.portfolio_accounts;
create policy "portfolio_accounts_select_own"
  on public.portfolio_accounts for select
  using (auth.uid() = user_id);

drop policy if exists "portfolio_accounts_insert_own" on public.portfolio_accounts;
create policy "portfolio_accounts_insert_own"
  on public.portfolio_accounts for insert
  with check (auth.uid() = user_id);

drop policy if exists "portfolio_accounts_update_own" on public.portfolio_accounts;
create policy "portfolio_accounts_update_own"
  on public.portfolio_accounts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "portfolio_accounts_delete_own" on public.portfolio_accounts;
create policy "portfolio_accounts_delete_own"
  on public.portfolio_accounts for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at on row update
create or replace function public.touch_portfolio_accounts_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolio_accounts_set_updated_at on public.portfolio_accounts;
create trigger portfolio_accounts_set_updated_at
  before update on public.portfolio_accounts
  for each row execute function public.touch_portfolio_accounts_updated_at();

-- =================================================================
-- monthly_balance_snapshots
-- =================================================================
create table if not exists public.monthly_balance_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  year integer not null check (year between 2000 and 2100),
  month integer not null check (month between 1 and 12),
  frozen_amount numeric(14, 2) not null,
  created_at timestamptz not null default now(),
  unique (user_id, year, month)
);

create index if not exists monthly_balance_snapshots_user_idx
  on public.monthly_balance_snapshots(user_id);

alter table public.monthly_balance_snapshots enable row level security;

drop policy if exists "monthly_balance_snapshots_select_own" on public.monthly_balance_snapshots;
create policy "monthly_balance_snapshots_select_own"
  on public.monthly_balance_snapshots for select
  using (auth.uid() = user_id);

drop policy if exists "monthly_balance_snapshots_insert_own" on public.monthly_balance_snapshots;
create policy "monthly_balance_snapshots_insert_own"
  on public.monthly_balance_snapshots for insert
  with check (auth.uid() = user_id);

drop policy if exists "monthly_balance_snapshots_update_own" on public.monthly_balance_snapshots;
create policy "monthly_balance_snapshots_update_own"
  on public.monthly_balance_snapshots for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "monthly_balance_snapshots_delete_own" on public.monthly_balance_snapshots;
create policy "monthly_balance_snapshots_delete_own"
  on public.monthly_balance_snapshots for delete
  using (auth.uid() = user_id);
