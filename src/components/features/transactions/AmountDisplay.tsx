'use client'

import { useEffect, useState } from 'react'
import type { TransactionType } from '@/lib/types/database'

interface AmountDisplayProps {
  cents: number
  type: TransactionType
  onChange?: (cents: number) => void
  autoFocus?: boolean
}

const LABEL: Record<TransactionType, string> = {
  income: 'Einnahme',
  expense: 'Ausgabe',
  savings_deposit: 'Spareinlage',
}

const MAX_CENTS = 9999999

function formatCents(cents: number): string {
  const euros = Math.floor(cents / 100)
  const centsPart = cents % 100
  return `${euros.toLocaleString('de-DE')},${String(centsPart).padStart(2, '0')}`
}

function centsToRawInput(cents: number): string {
  if (cents === 0) return ''
  const euros = Math.floor(cents / 100)
  const c = cents % 100
  return `${euros},${String(c).padStart(2, '0')}`
}

function parseInputToCents(raw: string): number {
  let clean = raw.replace(/[^\d.,]/g, '')
  const firstSep = clean.search(/[.,]/)
  if (firstSep !== -1) {
    const head = clean.slice(0, firstSep)
    const tail = clean.slice(firstSep + 1).replace(/[.,]/g, '').slice(0, 2)
    clean = head + '.' + tail
  }
  if (clean === '' || clean === '.') return 0
  const num = parseFloat(clean)
  if (Number.isNaN(num)) return 0
  const cents = Math.round(num * 100)
  return Math.max(0, Math.min(MAX_CENTS, cents))
}

export function AmountDisplay({ cents, type, onChange, autoFocus }: AmountDisplayProps) {
  const isEditable = !!onChange

  return (
    <div className="relative flex w-full justify-center">
      <div className="relative z-10 flex h-28 w-48 flex-col items-center justify-center rounded-[60%_40%_70%_30%/40%_50%_60%_40%] bg-secondary text-center shadow-[0_20px_50px_rgba(111,90,82,0.1)] lg:h-32 lg:w-56">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">
          {LABEL[type]}
        </span>
        {isEditable ? (
          <EditableAmount cents={cents} onChange={onChange} autoFocus={autoFocus} />
        ) : (
          <div className="font-heading text-3xl font-extrabold tracking-tighter text-foreground">
            € {formatCents(cents)}
          </div>
        )}
      </div>
      {/* Decorative blobs */}
      <div className="absolute -top-1 -right-1 -z-0 h-16 w-16 rounded-[30%_70%_40%_60%/50%_30%_70%_50%] bg-surface-container-high opacity-40" />
      <div className="absolute -bottom-2 -left-2 -z-0 h-10 w-10 rounded-[60%_40%_70%_30%/40%_50%_60%_40%] bg-primary-container opacity-10" />
    </div>
  )
}

function EditableAmount({
  cents,
  onChange,
  autoFocus,
}: {
  cents: number
  onChange: (cents: number) => void
  autoFocus?: boolean
}) {
  const [raw, setRaw] = useState(() => centsToRawInput(cents))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (parseInputToCents(raw) !== cents) {
      setRaw(centsToRawInput(cents))
    }
  }, [cents, raw])

  const display = focused ? raw : cents > 0 ? formatCents(cents) : ''

  const inputSize = Math.max(display.length || 4, 4)

  return (
    <div className="flex w-full items-baseline justify-center gap-3 px-2">
      <input
        type="text"
        inputMode="decimal"
        autoFocus={autoFocus}
        value={display}
        placeholder="0,00"
        size={inputSize}
        style={{ fieldSizing: 'content' } as React.CSSProperties}
        onChange={(e) => {
          const next = e.target.value
          setRaw(next)
          onChange(parseInputToCents(next))
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          setRaw(centsToRawInput(cents))
        }}
        enterKeyHint="done"
        className="bg-transparent p-0 text-center font-heading !text-4xl font-extrabold tracking-tighter tabular-nums text-foreground placeholder:text-on-secondary-container/50 focus:outline-none"
        aria-label="Betrag"
      />
      <span className="font-heading text-4xl font-extrabold tracking-tighter text-foreground">€</span>
    </div>
  )
}
