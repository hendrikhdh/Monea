-- =================================================================
-- Migration: Account sort order — manual drag-and-drop ordering
-- Run in Supabase Studio. Additive + idempotent (backfills only NULLs).
-- =================================================================
ALTER TABLE public.portfolio_accounts
  ADD COLUMN IF NOT EXISTS sort_order integer;

-- Backfill existing accounts per user by creation order (only untouched rows)
WITH ordered AS (
  SELECT id, (row_number() OVER (PARTITION BY user_id ORDER BY created_at, id) - 1) AS rn
  FROM public.portfolio_accounts
  WHERE sort_order IS NULL
)
UPDATE public.portfolio_accounts p
SET sort_order = o.rn
FROM ordered o
WHERE p.id = o.id;

CREATE INDEX IF NOT EXISTS portfolio_accounts_sort_idx
  ON public.portfolio_accounts(user_id, sort_order);
