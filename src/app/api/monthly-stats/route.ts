import { NextRequest, NextResponse } from 'next/server'
import { getMonthlyStats } from '@/lib/supabase/transactions'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const year = Number(searchParams.get('year'))
  const month = Number(searchParams.get('month'))

  if (!year || !month || month < 1 || month > 12) {
    return NextResponse.json({ error: 'Invalid year or month' }, { status: 400 })
  }

  try {
    const stats = await getMonthlyStats(year, month)
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
