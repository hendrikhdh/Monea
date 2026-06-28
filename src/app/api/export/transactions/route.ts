import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTransactions } from '@/lib/supabase/transactions'

function escapeCsv(value: string): string {
  if (/[;"\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function formatDateDE(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

function formatAmount(amount: number): string {
  // German decimal separator
  return amount.toFixed(2).replace('.', ',')
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const transactions = await getTransactions(10000)

    const header = ['Datum', 'Typ', 'Betrag', 'Kategorie / Sparziel', 'Konto', 'Notiz']
    const typeLabel = {
      income: 'Einnahme',
      expense: 'Ausgabe',
      savings_deposit: 'Spareinlage',
      transfer: 'Transfer',
    } as const
    const rows = transactions.map((tx) => [
      formatDateDE(tx.date),
      typeLabel[tx.type],
      formatAmount(Number(tx.amount)),
      tx.type === 'savings_deposit'
        ? (tx.goal?.name ?? '')
        : (tx.category?.name ?? ''),
      tx.type === 'transfer'
        ? `${tx.account?.name ?? ''} → ${tx.to_account?.name ?? ''}`
        : (tx.account?.name ?? ''),
      tx.note ?? '',
    ])

    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsv).join(';'))
      .join('\r\n')

    // UTF-8 BOM for Excel-DE compatibility
    const body = '﻿' + csv

    const today = new Date().toISOString().slice(0, 10)
    const filename = `monea-transaktionen-${today}.csv`

    return new NextResponse(body, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
