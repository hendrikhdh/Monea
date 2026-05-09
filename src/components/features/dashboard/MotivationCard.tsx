'use client'

import { useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import { MOTIVATION_QUOTES } from '@/lib/data/motivationQuotes'
import { cn } from '@/lib/utils'

function getRandomIndex(exclude?: number): number {
  let index: number
  do {
    index = Math.floor(Math.random() * MOTIVATION_QUOTES.length)
  } while (index === exclude)
  return index
}

export function MotivationCard() {
  const [index, setIndex] = useState(() => getRandomIndex())
  const [isAnimating, setIsAnimating] = useState(false)

  const refresh = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setIndex((prev) => getRandomIndex(prev))
      setIsAnimating(false)
    }, 200)
  }, [])

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-surface-container-low px-7 py-8">
      <div
        className={cn(
          'transition-opacity duration-200',
          isAnimating ? 'opacity-0' : 'opacity-100'
        )}
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          Daily Motivation
        </p>
        <p className="mt-4 font-display text-xl leading-relaxed text-foreground">
          &ldquo;{MOTIVATION_QUOTES[index]}&rdquo;
        </p>
      </div>

      <button
        type="button"
        onClick={refresh}
        className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-background/60 text-on-surface-variant transition-all active:scale-90"
        style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        aria-label="New quote"
      >
        <RefreshCw size={18} />
      </button>
    </section>
  )
}
