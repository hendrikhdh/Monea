import {
  getRangeForPeriod,
  getSpendingByCategoryForRange,
  getMonthlyTrend,
  type AnalyticsPeriod,
  type AnalyticsType,
} from '@/lib/supabase/analytics'
import { AnalyticsShell } from '@/components/features/analytics/AnalyticsShell'

const DEFAULT_PERIOD: AnalyticsPeriod = 'month'
const DEFAULT_TYPE: AnalyticsType = 'expense'

export default async function AnalyticsPage() {
  const range = getRangeForPeriod(DEFAULT_PERIOD)
  const trendMonths = DEFAULT_PERIOD === 'month' ? 3 : range.monthCount

  const [spending, trend] = await Promise.all([
    getSpendingByCategoryForRange(range.from, range.to, DEFAULT_TYPE),
    getMonthlyTrend(trendMonths),
  ])

  return (
    <AnalyticsShell
      initialPeriod={DEFAULT_PERIOD}
      initialType={DEFAULT_TYPE}
      initialSpending={spending}
      initialTrend={trend}
    />
  )
}
