import { getTransactions } from '@/lib/supabase/transactions'
import { getCategories } from '@/lib/supabase/categories'
import { TransactionsView } from '@/components/features/transactions/TransactionsView'

interface TransactionsPageProps {
  searchParams: Promise<{ filter?: string }>
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const params = await searchParams
  const initialFilter = params.filter === 'income' || params.filter === 'expense'
    ? params.filter
    : 'all'

  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories(),
  ])

  return (
    <TransactionsView
      transactions={transactions}
      categories={categories}
      initialFilter={initialFilter}
    />
  )
}
