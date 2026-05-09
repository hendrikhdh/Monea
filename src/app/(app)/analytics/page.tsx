import { getSpendingByCategoryWithNames, getMonthlyTrend } from '@/lib/supabase/analytics'
import { AnalyticsShell } from '@/components/features/analytics/AnalyticsShell'

const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

export default async function AnalyticsPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const [spending, trend] = await Promise.all([
    getSpendingByCategoryWithNames(year, month),
    getMonthlyTrend(6),
  ])

  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`

  return (
    <AnalyticsShell
      monthLabel={monthLabel}
      spending={spending}
      trend={trend}
    />
  )
}
