import { getTransactions } from '@/lib/supabase/transactions'
import { getCategories } from '@/lib/supabase/categories'
import { getRecurringTransactions } from '@/lib/supabase/recurring'
import { getGoals } from '@/lib/supabase/goals'
import { TransactionsView } from '@/components/features/transactions/TransactionsView'
import { RecurringView } from '@/components/features/transactions/RecurringView'

interface TransactionsPageProps {
  searchParams: Promise<{ filter?: string; tab?: string }>
}

const VALID_FILTERS = ['income', 'expense', 'savings_deposit'] as const
type TxFilter = 'all' | (typeof VALID_FILTERS)[number]

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const params = await searchParams
  const initialFilter: TxFilter = VALID_FILTERS.includes(params.filter as (typeof VALID_FILTERS)[number])
    ? (params.filter as (typeof VALID_FILTERS)[number])
    : 'all'
  const tab = params.tab === 'recurring' ? 'recurring' : 'single'

  const [transactions, categories, recurring, goals] = await Promise.all([
    getTransactions(),
    getCategories(),
    getRecurringTransactions(),
    getGoals(),
  ])

  if (tab === 'recurring') {
    return <RecurringView items={recurring} categories={categories} goals={goals} />
  }

  return (
    <TransactionsView
      transactions={transactions}
      categories={categories}
      goals={goals}
      initialFilter={initialFilter}
    />
  )
}
