-- =================================================================
-- Migration: Budgets — drop monthly dimension, make general
-- =================================================================
-- Removes year/month columns from budgets, keeping one budget per
-- (user_id, category_id). For each (user, category) pair, the most
-- recent existing budget row is kept; older rows are deleted.
-- =================================================================

-- 1. Deduplicate: keep only the most recent budget per (user, category).
delete from public.budgets b
using public.budgets b2
where b.user_id = b2.user_id
  and b.category_id = b2.category_id
  and b.created_at < b2.created_at;

-- Edge case: same created_at — keep one arbitrary row by id.
delete from public.budgets b
using public.budgets b2
where b.user_id = b2.user_id
  and b.category_id = b2.category_id
  and b.created_at = b2.created_at
  and b.id < b2.id;

-- 2. Drop year + month columns. CASCADE so any unique constraint that
--    references year/month is dropped automatically.
alter table public.budgets drop column if exists year cascade;
alter table public.budgets drop column if exists month cascade;

-- 3. Add new unique constraint: one budget per (user, category).
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'budgets_user_id_category_id_key'
      and conrelid = 'public.budgets'::regclass
  ) then
    alter table public.budgets
      add constraint budgets_user_id_category_id_key
      unique (user_id, category_id);
  end if;
end$$;
