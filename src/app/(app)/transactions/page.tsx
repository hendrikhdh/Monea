import { getTransactions } from '@/lib/supabase/transactions'
import { getCategories } from '@/lib/supabase/categories'
import { getRecurringTransactions } from '@/lib/supabase/recurring'
import { TransactionsView } from '@/components/features/transactions/TransactionsView'
import { RecurringView } from '@/components/features/transactions/RecurringView'

interface TransactionsPageProps {
  searchParams: Promise<{ filter?: string; tab?: string }>
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const params = await searchParams
  const initialFilter = params.filter === 'income' || params.filter === 'expense'
    ? params.filter
    : 'all'
  const tab = params.tab === 'recurring' ? 'recurring' : 'single'

  const [transactions, categories, recurring] = await Promise.all([
    getTransactions(),
    getCategories(),
    getRecurringTransactions(),
  ])

  if (tab === 'recurring') {
    return <RecurringView items={recurring} categories={categories} />
  }

  return (
    <TransactionsView
      transactions={transactions}
      categories={categories}
      initialFilter={initialFilter}
    />
  )
}
