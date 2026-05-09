'use client'

import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'

const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

interface MonthlyOverviewProps {
  initialYear: number
  initialMonth: number
  initialIncome: number
  initialExpenses: number
}

export function MonthlyOverview({
  initialYear,
  initialMonth,
  initialIncome,
  initialExpenses,
}: MonthlyOverviewProps) {
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
  const format = (value: number) =>
    new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(value)

  return (
    <section>
      {/* Month selector */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-90 hover:bg-surface-container"
        >
          <ChevronLeft size={20} className="text-muted-foreground" />
        </button>

        <div className="text-center">
          <p className="font-heading text-lg font-bold text-foreground">
            {MONTH_NAMES[month - 1]} {year !== initialYear ? year : ''}
          </p>
          {isCurrentMonth && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Aktueller Monat
            </p>
          )}
        </div>

        <button
          onClick={() => navigate(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-90 hover:bg-surface-container"
        >
          <ChevronRight size={20} className="text-muted-foreground" />
        </button>
      </div>

      {/* Swipeable content */}
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
          className="touch-pan-y"
          style={{ touchAction: 'pan-y' }}
        >
          <div className={loading ? 'pointer-events-none opacity-50 transition-opacity' : 'transition-opacity'}>
            {/* Balance summary */}
            <div className="mb-4 rounded-xl bg-surface-container-low p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Monatssaldo
              </p>
              <p className={`mt-1 font-display text-2xl font-semibold ${balance >= 0 ? 'text-foreground' : 'text-destructive'}`}>
                {balance >= 0 ? '+' : ''}{format(balance)} €
              </p>
            </div>

            {/* Income / Expenses cards */}
            <div className="grid grid-cols-2 gap-4">
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
                  +{format(income)}
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
                  -{format(expenses)}
                </p>
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
