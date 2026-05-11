'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { formatCurrency, formatCurrencyShort } from '@/lib/utils/formatCurrency'

const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

interface MonthlyViewProps {
  initialYear: number
  initialMonth: number
  initialIncome: number
  initialExpenses: number
}

export function MonthlyView({
  initialYear,
  initialMonth,
  initialIncome,
  initialExpenses,
}: MonthlyViewProps) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [income, setIncome] = useState(initialIncome)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [loading, setLoading] = useState(false)
  const [direction, setDirection] = useState(0)

  const isCurrentMonth = year === initialYear && month === initialMonth

  const fetchStats = useCallback(async (y: number, m: number) => {
    if (y === initialYear && m === initialMonth) {
      setIncome(initialIncome)
      setExpenses(initialExpenses)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/monthly-stats?year=${y}&month=${m}`)
      if (res.ok) {
        const data = await res.json()
        setIncome(data.income)
        setExpenses(data.expenses)
      }
    } finally {
      setLoading(false)
    }
  }, [initialYear, initialMonth, initialIncome, initialExpenses])

  const navigate = useCallback((dir: -1 | 1) => {
    setDirection(dir)
    let newMonth = month + dir
    let newYear = year
    if (newMonth < 1) { newMonth = 12; newYear-- }
    if (newMonth > 12) { newMonth = 1; newYear++ }
    setMonth(newMonth)
    setYear(newYear)
    fetchStats(newYear, newMonth)
  }, [month, year, fetchStats])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 50) {
      navigate(info.offset.x > 0 ? -1 : 1)
    }
  }

  const balance = income - expenses
  const balancePositive = balance >= 0

  return (
    <div className="space-y-4">
      {/* Hero: Monatssaldo + Month Switcher */}
      <section className="relative overflow-hidden rounded-[3rem_1rem_4rem_3rem] bg-gradient-to-br from-primary to-primary-container p-8 text-primary-foreground shadow-xl">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-muted-foreground opacity-20 blur-3xl" />

        {/* Month switcher row */}
        <div className="relative z-10 mb-2 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-primary-foreground transition-all active:scale-90"
            aria-label="Vorheriger Monat"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-center">
            <p className="font-heading text-base font-bold text-primary-foreground">
              {MONTH_NAMES[month - 1]} {year !== initialYear ? year : ''}
            </p>
            {isCurrentMonth && (
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-secondary">
                Aktueller Monat
              </p>
            )}
          </div>

          <button
            onClick={() => navigate(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-primary-foreground transition-all active:scale-90"
            aria-label="Nächster Monat"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Swipeable balance display */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, x: direction * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -80 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            className="relative z-10 touch-pan-y"
            style={{ touchAction: 'pan-y' }}
          >
            <div className={loading ? 'pointer-events-none opacity-60 transition-opacity' : 'transition-opacity'}>
              <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-secondary">
                Monatssaldo
              </p>
              <h1 className="mt-2 font-display text-5xl font-normal leading-tight">
                {balancePositive ? '+' : ''}{formatCurrencyShort(balance)} €
              </h1>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Income / Expenses cards */}
      <div className={`grid grid-cols-2 gap-4 ${loading ? 'opacity-60' : ''} transition-opacity`}>
        <Link
          href="/transactions?filter=income"
          className="flex flex-col items-center justify-center rounded-xl bg-surface-container-low p-6 text-center transition-all active:scale-[0.97]"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50">
            <TrendingUp size={20} className="text-secondary-foreground" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Einnahmen
          </p>
          <p className="mt-1 font-display text-xl text-foreground">
            +{formatCurrency(income)}
          </p>
        </Link>

        <Link
          href="/transactions?filter=expense"
          className="flex flex-col items-center justify-center rounded-xl bg-surface-container-low p-6 text-center transition-all active:scale-[0.97]"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <TrendingDown size={20} className="text-destructive" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Ausgaben
          </p>
          <p className="mt-1 font-display text-xl text-foreground">
            -{formatCurrency(expenses)}
          </p>
        </Link>
      </div>
    </div>
  )
}
