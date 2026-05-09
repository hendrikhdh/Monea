'use client'

import { useRef } from 'react'
import type { Category } from '@/lib/types/database'
import { ICON_MAP } from '@/components/features/categories/iconMap'
import { getShapeForCategory } from '@/components/features/categories/organicShapes'
import { cn } from '@/lib/utils'

interface CategoryPickerProps {
  categories: Category[]
  selected: string | null
  onSelect: (id: string | null) => void
}

export function CategoryPicker({ categories, selected, onSelect }: CategoryPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (categories.length === 0) return null

  const selectedCategory = categories.find((c) => c.id === selected)

  return (
    <div className="w-full">
      <p className="mb-2 text-center text-xs text-muted-foreground">
        {selectedCategory ? selectedCategory.name : 'Wähle eine Kategorie'}
      </p>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-6 pt-2 pb-2 no-scrollbar snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon]
          const isActive = selected === cat.id
          const shapeClass = getShapeForCategory(cat.id)
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(isActive ? null : cat.id)}
              className="flex shrink-0 snap-center flex-col items-center gap-2"
            >
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center transition-all duration-300 active:scale-90',
                  shapeClass,
                  isActive
                    ? 'shadow-[0_10px_20px_rgba(250,220,210,0.4)] ring-2 ring-foreground ring-offset-2 ring-offset-background'
                    : 'shadow-sm'
                )}
                style={{
                  backgroundColor: isActive ? `${cat.color}40` : `${cat.color}20`,
                }}
              >
                {Icon ? (
                  <Icon
                    size={20}
                    style={{ color: isActive ? cat.color : undefined }}
                    className={isActive ? '' : 'text-muted-foreground'}
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">{cat.icon}</span>
                )}
              </div>
              <span
                className={cn(
                  'w-16 truncate text-center text-[10px] font-semibold uppercase tracking-widest',
                  isActive ? 'font-bold text-foreground' : 'text-on-secondary-container'
                )}
              >
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
