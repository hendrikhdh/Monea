import { NextRequest, NextResponse } from 'next/server'
import {
  getRangeForPeriod,
  getSpendingByCategoryForRange,
  getMonthlyTrend,
  type AnalyticsPeriod,
  type AnalyticsType,
} from '@/lib/supabase/analytics'

const PERIODS: AnalyticsPeriod[] = ['month', '3m', '6m', '1y']
const TYPES: AnalyticsType[] = ['expense', 'income']

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const period = searchParams.get('period') as AnalyticsPeriod | null
  const type = searchParams.get('type') as AnalyticsType | null

  if (!period || !PERIODS.includes(period)) {
    return NextResponse.json({ error: 'Invalid period' }, { status: 400 })
  }
  if (!type || !TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  try {
    const range = getRangeForPeriod(period)
    const trendMonths = period === 'month' ? 3 : range.monthCount

    const [spending, trend] = await Promise.all([
      getSpendingByCategoryForRange(range.from, range.to, type),
      getMonthlyTrend(trendMonths),
    ])

    return NextResponse.json({ spending, trend })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
