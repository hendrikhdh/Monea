'use client'

import { Delete } from 'lucide-react'

interface NumericKeypadProps {
  onDigit: (digit: string) => void
  onBackspace: () => void
}

export function NumericKeypad({ onDigit, onBackspace }: NumericKeypadProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onDigit(key)}
          className="flex h-14 items-center justify-center rounded-full bg-surface-container-lowest font-heading text-xl font-bold text-foreground transition-colors hover:bg-surface-container-high active:scale-90 active:duration-200"
        >
          {key}
        </button>
      ))}
      <div />
      <button
        type="button"
        onClick={() => onDigit('0')}
        className="flex h-14 items-center justify-center rounded-full bg-surface-container-lowest font-heading text-xl font-bold text-foreground transition-colors hover:bg-surface-container-high active:scale-90 active:duration-200"
      >
        0
      </button>
      <button
        type="button"
        onClick={onBackspace}
        className="flex h-14 items-center justify-center rounded-full bg-secondary/30 font-heading text-xl font-bold text-foreground transition-colors hover:bg-secondary active:scale-90 active:duration-200"
      >
        <Delete size={22} />
      </button>
    </div>
  )
}
