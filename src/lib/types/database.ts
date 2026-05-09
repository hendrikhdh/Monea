export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense' | 'both'
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  category_id: string | null
  amount: number
  type: 'income' | 'expense'
  date: string
  note: string | null
  created_at: string
}

export interface TransactionWithCategory extends Transaction {
  category: Category | null
}

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  image_path: string | null
  created_at: string
}
