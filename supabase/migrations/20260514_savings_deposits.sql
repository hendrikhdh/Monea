-- Savings Deposits: third transaction type linked to goals
-- Run this in Supabase Studio (SQL Editor) on naaimcnrpbyrrzdingcf

-- 1. Extend type check on transactions + recurring_transactions
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check
  CHECK (type IN ('income', 'expense', 'savings_deposit'));

ALTER TABLE recurring_transactions DROP CONSTRAINT IF EXISTS recurring_transactions_type_check;
ALTER TABLE recurring_transactions ADD CONSTRAINT recurring_transactions_type_check
  CHECK (type IN ('income', 'expense', 'savings_deposit'));

-- 2. Add goal_id columns (CASCADE: deleting a goal removes its deposit history)
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS goal_id uuid REFERENCES goals(id) ON DELETE CASCADE;

ALTER TABLE recurring_transactions
  ADD COLUMN IF NOT EXISTS goal_id uuid REFERENCES goals(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_transactions_goal_id
  ON transactions(goal_id) WHERE goal_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_recurring_goal_id
  ON recurring_transactions(goal_id) WHERE goal_id IS NOT NULL;

-- 3. Backfill: existing goals.current_amount > 0 → first "Initialbetrag" deposit
INSERT INTO transactions (user_id, goal_id, amount, type, date, note, category_id)
SELECT user_id, id, current_amount, 'savings_deposit',
       (created_at AT TIME ZONE 'UTC')::date, 'Initialbetrag', NULL
FROM goals
WHERE current_amount > 0
  AND NOT EXISTS (
    SELECT 1 FROM transactions t
    WHERE t.goal_id = goals.id AND t.type = 'savings_deposit'
  );

-- 4. Consistency check: savings_deposit ⇔ goal_id set, category_id null
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_goal_consistency;
ALTER TABLE transactions ADD CONSTRAINT transactions_goal_consistency
  CHECK (
    (type = 'savings_deposit' AND goal_id IS NOT NULL AND category_id IS NULL)
    OR (type IN ('income','expense') AND goal_id IS NULL)
  );

ALTER TABLE recurring_transactions DROP CONSTRAINT IF EXISTS recurring_goal_consistency;
ALTER TABLE recurring_transactions ADD CONSTRAINT recurring_goal_consistency
  CHECK (
    (type = 'savings_deposit' AND goal_id IS NOT NULL AND category_id IS NULL)
    OR (type IN ('income','expense') AND goal_id IS NULL)
  );

-- 5. Trigger: keep goals.current_amount in sync with SUM(savings_deposit amounts)
CREATE OR REPLACE FUNCTION recompute_goal_current_amount(p_goal_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE goals
  SET current_amount = COALESCE((
    SELECT SUM(amount) FROM transactions
    WHERE goal_id = p_goal_id AND type = 'savings_deposit'
  ), 0)
  WHERE id = p_goal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION trg_sync_goal_amount()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.goal_id IS NOT NULL THEN
    PERFORM recompute_goal_current_amount(NEW.goal_id);
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.goal_id IS NOT NULL THEN
      PERFORM recompute_goal_current_amount(OLD.goal_id);
    END IF;
    IF NEW.goal_id IS NOT NULL AND NEW.goal_id IS DISTINCT FROM OLD.goal_id THEN
      PERFORM recompute_goal_current_amount(NEW.goal_id);
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.goal_id IS NOT NULL THEN
    PERFORM recompute_goal_current_amount(OLD.goal_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS transactions_sync_goal_amount ON transactions;
CREATE TRIGGER transactions_sync_goal_amount
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION trg_sync_goal_amount();

-- 6. Sanity sync (idempotent): align current_amount for all goals
UPDATE goals g
SET current_amount = COALESCE((
  SELECT SUM(amount) FROM transactions
  WHERE goal_id = g.id AND type = 'savings_deposit'
), 0);
