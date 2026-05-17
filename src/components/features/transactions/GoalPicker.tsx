'use client'

import { Target } from 'lucide-react'
import { getShapeForCategory } from '@/components/features/categories/organicShapes'
import { cn } from '@/lib/utils'
import type { Goal } from '@/lib/types/database'

interface GoalPickerProps {
  goals: Pick<Goal, 'id' | 'name' | 'target_amount' | 'current_amount'>[]
  selected: string | null
  onSelect: (id: string | null) => void
}

export function GoalPicker({ goals, selected, onSelect }: GoalPickerProps) {
  if (goals.length === 0) {
    return (
      <div className="w-full px-6 text-center">
        <p className="text-xs text-muted-foreground">
          Lege zuerst ein Sparziel an, um Einzahlungen zu erfassen.
        </p>
      </div>
    )
  }

  const selectedGoal = goals.find((g) => g.id === selected)
  const subtitle = selectedGoal
    ? `€${Number(selectedGoal.current_amount).toLocaleString('de-DE')} / €${Number(selectedGoal.target_amount).toLocaleString('de-DE')}`
    : 'Wähle ein Sparziel'

  return (
    <div className="w-full">
      <p className="mb-2 text-center text-xs text-muted-foreground">
        {selectedGoal ? selectedGoal.name : subtitle}
      </p>
      <div
        className="flex gap-3 overflow-x-auto px-6 pt-2 pb-2 no-scrollbar snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0 lg:snap-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {goals.map((goal) => {
          const isActive = selected === goal.id
          const shapeClass = getShapeForCategory(goal.id)
          const pct = goal.target_amount > 0
            ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
            : 0
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelect(isActive ? null : goal.id)}
              className="flex shrink-0 snap-center flex-col items-center gap-2"
            >
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center bg-primary-container/40 transition-all duration-300 active:scale-90',
                  shapeClass,
                  isActive
                    ? 'shadow-[0_10px_20px_rgba(250,220,210,0.4)] ring-2 ring-foreground ring-offset-2 ring-offset-background'
                    : 'shadow-sm'
                )}
              >
                <Target
                  size={20}
                  className={isActive ? 'text-foreground' : 'text-on-secondary-container'}
                />
              </div>
              <span
                className={cn(
                  'w-16 truncate text-center text-[10px] font-semibold uppercase tracking-widest',
                  isActive ? 'font-bold text-foreground' : 'text-on-secondary-container'
                )}
              >
                {goal.name}
              </span>
              <span className="text-[9px] tabular-nums text-muted-foreground">
                {pct}%
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
