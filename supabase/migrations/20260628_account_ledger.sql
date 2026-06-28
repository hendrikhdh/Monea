-- =================================================================
-- Migration: Account Ledger — account-linked transactions + transfers
-- Run this in Supabase Studio (SQL Editor). Idempotent: safe to re-run.
-- =================================================================
-- Turns Monéa into a full multi-account ledger:
--  - Every income / expense / transfer transaction belongs to an account
--  - A primary "Girokonto" account is auto-created per user and absorbs all
--    existing income/expense transactions
--  - portfolio_accounts.current_amount = initial_amount + ledger effects,
--    maintained by an AFTER trigger (mirrors the goals trigger pattern in
--    20260514_savings_deposits.sql)
--  - Transfers are a 4th transaction type (account_id -> to_account_id), one row
--  - Savings deposits stay unchanged (goal-linked, balance-neutral, no account)
--
-- Designed to PRESERVE each user's current total exactly (no balance jump):
--   old_total = Σ(named accounts) + Σ_months(frozen ? frozen : live)
--   new_total = Σ(all accounts), where Girokonto.initial_amount carries the
--   net frozen-snapshot adjustment so the sum is identical.
-- =================================================================

-- -----------------------------------------------------------------
-- 1. portfolio_accounts: initial_amount, is_primary, 'checking' type
-- -----------------------------------------------------------------
ALTER TABLE public.portfolio_accounts
  ADD COLUMN IF NOT EXISTS initial_amount numeric(14, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_primary boolean NOT NULL DEFAULT false;

ALTER TABLE public.portfolio_accounts DROP CONSTRAINT IF EXISTS portfolio_accounts_type_check;
ALTER TABLE public.portfolio_accounts ADD CONSTRAINT portfolio_accounts_type_check
  CHECK (type IN ('checking', 'savings', 'brokerage', 'cash', 'other'));

-- At most one primary (Girokonto) per user
CREATE UNIQUE INDEX IF NOT EXISTS portfolio_accounts_one_primary
  ON public.portfolio_accounts(user_id) WHERE is_primary;

-- Existing (non-primary) accounts: their manual balance becomes the start balance.
-- Idempotent: for untagged accounts current_amount == initial_amount, so re-running is a no-op.
UPDATE public.portfolio_accounts SET initial_amount = current_amount
WHERE is_primary = false AND initial_amount IS DISTINCT FROM current_amount;

-- -----------------------------------------------------------------
-- 2. transactions / recurring_transactions: account columns + transfer type
-- -----------------------------------------------------------------
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES public.portfolio_accounts(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS to_account_id uuid REFERENCES public.portfolio_accounts(id) ON DELETE RESTRICT;

ALTER TABLE public.recurring_transactions
  ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES public.portfolio_accounts(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_transactions_account_id
  ON public.transactions(account_id) WHERE account_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_to_account_id
  ON public.transactions(to_account_id) WHERE to_account_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_recurring_account_id
  ON public.recurring_transactions(account_id) WHERE account_id IS NOT NULL;

-- Allow 'transfer' as a 4th type on transactions (recurring stays without transfer)
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_type_check;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_type_check
  CHECK (type IN ('income', 'expense', 'savings_deposit', 'transfer'));

-- -----------------------------------------------------------------
-- 3. Per-user backfill: create Girokonto, tag existing income/expense
-- -----------------------------------------------------------------
DO $$
DECLARE
  u RECORD;
  v_giro_id uuid;
  v_frozen_adj numeric(14, 2);
BEGIN
  FOR u IN SELECT DISTINCT user_id FROM public.transactions LOOP
    SELECT id INTO v_giro_id FROM public.portfolio_accounts
      WHERE user_id = u.user_id AND is_primary = true LIMIT 1;

    IF v_giro_id IS NULL THEN
      -- Net frozen-snapshot adjustment (frozen value vs. live month) to preserve total
      SELECT COALESCE(SUM(s.frozen_amount - COALESCE(live.amount, 0)), 0)
      INTO v_frozen_adj
      FROM public.monthly_balance_snapshots s
      LEFT JOIN LATERAL (
        SELECT SUM(CASE WHEN t.type = 'income' THEN t.amount
                        WHEN t.type = 'expense' THEN -t.amount ELSE 0 END) AS amount
        FROM public.transactions t
        WHERE t.user_id = s.user_id
          AND t.type IN ('income', 'expense')
          AND EXTRACT(YEAR FROM t.date) = s.year
          AND EXTRACT(MONTH FROM t.date) = s.month
      ) live ON true
      WHERE s.user_id = u.user_id;

      INSERT INTO public.portfolio_accounts
        (user_id, name, type, initial_amount, current_amount, icon, color, is_primary)
      VALUES
        (u.user_id, 'Girokonto', 'checking', v_frozen_adj, v_frozen_adj, 'Landmark', '#56423b', true)
      RETURNING id INTO v_giro_id;
    END IF;

    UPDATE public.transactions
      SET account_id = v_giro_id
      WHERE user_id = u.user_id AND type IN ('income', 'expense') AND account_id IS NULL;

    UPDATE public.recurring_transactions
      SET account_id = v_giro_id
      WHERE user_id = u.user_id AND type IN ('income', 'expense') AND account_id IS NULL;
  END LOOP;
END $$;

-- -----------------------------------------------------------------
-- 4. Consistency constraints (now satisfiable after backfill)
-- -----------------------------------------------------------------
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_goal_consistency;
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_ledger_consistency;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_ledger_consistency CHECK (
  (type = 'savings_deposit' AND goal_id IS NOT NULL AND category_id IS NULL
     AND account_id IS NULL AND to_account_id IS NULL)
  OR (type IN ('income', 'expense') AND goal_id IS NULL
     AND account_id IS NOT NULL AND to_account_id IS NULL)
  OR (type = 'transfer' AND goal_id IS NULL AND category_id IS NULL
     AND account_id IS NOT NULL AND to_account_id IS NOT NULL AND account_id <> to_account_id)
);

ALTER TABLE public.recurring_transactions DROP CONSTRAINT IF EXISTS recurring_goal_consistency;
ALTER TABLE public.recurring_transactions DROP CONSTRAINT IF EXISTS recurring_ledger_consistency;
ALTER TABLE public.recurring_transactions ADD CONSTRAINT recurring_ledger_consistency CHECK (
  (type = 'savings_deposit' AND goal_id IS NOT NULL AND category_id IS NULL AND account_id IS NULL)
  OR (type IN ('income', 'expense') AND goal_id IS NULL AND account_id IS NOT NULL)
);

-- -----------------------------------------------------------------
-- 5. Balance trigger: current_amount = initial_amount + ledger
-- -----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.recompute_account_balance(p_account_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.portfolio_accounts a
  SET current_amount = a.initial_amount
    + COALESCE((SELECT SUM(t.amount) FROM public.transactions t
                WHERE t.account_id = p_account_id AND t.type = 'income'), 0)
    - COALESCE((SELECT SUM(t.amount) FROM public.transactions t
                WHERE t.account_id = p_account_id AND t.type = 'expense'), 0)
    + COALESCE((SELECT SUM(t.amount) FROM public.transactions t
                WHERE t.to_account_id = p_account_id AND t.type = 'transfer'), 0)
    - COALESCE((SELECT SUM(t.amount) FROM public.transactions t
                WHERE t.account_id = p_account_id AND t.type = 'transfer'), 0)
  WHERE a.id = p_account_id;
END;
$$;

-- Recompute every account touched by a transaction change (duplicate calls are harmless)
CREATE OR REPLACE FUNCTION public.trg_sync_account_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    IF NEW.account_id IS NOT NULL THEN PERFORM public.recompute_account_balance(NEW.account_id); END IF;
    IF NEW.to_account_id IS NOT NULL THEN PERFORM public.recompute_account_balance(NEW.to_account_id); END IF;
  END IF;
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    IF OLD.account_id IS NOT NULL THEN PERFORM public.recompute_account_balance(OLD.account_id); END IF;
    IF OLD.to_account_id IS NOT NULL THEN PERFORM public.recompute_account_balance(OLD.to_account_id); END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS transactions_sync_account_balance ON public.transactions;
CREATE TRIGGER transactions_sync_account_balance
AFTER INSERT OR UPDATE OR DELETE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.trg_sync_account_balance();

-- Editing an account's start balance recomputes its current balance
CREATE OR REPLACE FUNCTION public.trg_account_initial_changed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.recompute_account_balance(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS portfolio_accounts_initial_changed ON public.portfolio_accounts;
CREATE TRIGGER portfolio_accounts_initial_changed
AFTER UPDATE OF initial_amount ON public.portfolio_accounts
FOR EACH ROW
WHEN (NEW.initial_amount IS DISTINCT FROM OLD.initial_amount)
EXECUTE FUNCTION public.trg_account_initial_changed();

-- -----------------------------------------------------------------
-- 6. Final bulk recompute (idempotent sanity sync)
-- -----------------------------------------------------------------
DO $$
DECLARE a RECORD;
BEGIN
  FOR a IN SELECT id FROM public.portfolio_accounts LOOP
    PERFORM public.recompute_account_balance(a.id);
  END LOOP;
END $$;

-- -----------------------------------------------------------------
-- 7. Harden: these helpers run only inside triggers (or internally via PERFORM),
--    never through the REST/RPC API. Revoke EXECUTE so anon/authenticated cannot
--    call them directly. Triggers keep working (invoked by the trigger mechanism).
-- -----------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.recompute_account_balance(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.trg_sync_account_balance() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.trg_account_initial_changed() FROM anon, authenticated, public;
