export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense' | 'both'
  created_at: string
}

export type TransactionType = 'income' | 'expense' | 'savings_deposit' | 'transfer'

export interface Transaction {
  id: string
  user_id: string
  category_id: string | null
  goal_id: string | null
  account_id: string | null
  to_account_id: string | null
  amount: number
  type: TransactionType
  date: string
  note: string | null
  created_at: string
}

export type AccountRef = Pick<PortfolioAccount, 'id' | 'name' | 'icon' | 'color' | 'type'>

export interface TransactionWithCategory extends Transaction {
  category: Category | null
  goal: Pick<Goal, 'id' | 'name'> | null
  account: AccountRef | null
  to_account: AccountRef | null
}

export interface Budget {
  id: string
  user_id: string
  category_id: string
  amount: number
  created_at: string
}

export interface BudgetWithCategory extends Budget {
  category: Category
}

export interface RecurringTransaction {
  id: string
  user_id: string
  category_id: string | null
  goal_id: string | null
  account_id: string | null
  amount: number
  type: TransactionType
  note: string | null
  interval: 'weekly' | 'monthly' | 'yearly'
  start_date: string
  next_due: string
  is_active: boolean
  created_at: string
}

export interface RecurringTransactionWithCategory extends RecurringTransaction {
  category: Category | null
  goal: Pick<Goal, 'id' | 'name'> | null
}

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  image_path: string | null
  image_aspect: string | null
  created_at: string
}

export type PortfolioAccountType = 'checking' | 'savings' | 'brokerage' | 'cash' | 'other'

export interface PortfolioAccount {
  id: string
  user_id: string
  name: string
  type: PortfolioAccountType
  initial_amount: number
  current_amount: number
  is_primary: boolean
  icon: string
  color: string
  created_at: string
  updated_at: string
}

export interface MonthlyBalanceSnapshot {
  id: string
  user_id: string
  year: number
  month: number
  frozen_amount: number
  created_at: string
}
