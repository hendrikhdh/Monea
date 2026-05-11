import { ChevronRight } from 'lucide-react'
import type { Category } from '@/lib/types/database'
import { ICON_MAP } from './iconMap'
import { getShapeForCategory } from './organicShapes'
import { cn } from '@/lib/utils'

const BLOB_SHAPES = [
  'rounded-[3rem_1rem_3rem_4rem]',
  'rounded-[2rem_4rem_2rem_3rem]',
]

interface CategoryListProps {
  categories: Category[]
  onEdit?: (category: Category) => void
}

export function CategoryList({ categories, onEdit }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Keine Kategorien für diesen Filter.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {categories.map((cat, i) => (
        <CategoryItem
          key={cat.id}
          category={cat}
          blobIndex={i % BLOB_SHAPES.length}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}

function CategoryItem({
  category,
  blobIndex,
  onEdit,
}: {
  category: Category
  blobIndex: number
  onEdit?: (category: Category) => void
}) {
  const IconComponent = ICON_MAP[category.icon]

  return (
    <button
      type="button"
      onClick={() => onEdit?.(category)}
      className={cn(
        'flex w-full items-center justify-between bg-surface-container-low p-6 text-left transition-all duration-300 active:scale-[0.98] hover:bg-surface-container',
        BLOB_SHAPES[blobIndex]
      )}
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center transition-all duration-300',
            getShapeForCategory(category.id)
          )}
          style={{
            backgroundColor: `${category.color}25`,
          }}
        >
          {IconComponent ? (
            <IconComponent size={20} style={{ color: category.color }} />
          ) : (
            <span className="text-sm" style={{ color: category.color }}>
              {category.icon}
            </span>
          )}
        </div>
        <div>
          <p className="font-heading text-lg font-bold text-foreground">
            {category.name}
          </p>
          <p className="text-sm capitalize text-muted-foreground">
            {category.type === 'both' ? 'Einnahmen & Ausgaben' : category.type === 'income' ? 'Einnahmen' : 'Ausgaben'}
          </p>
        </div>
      </div>

      <ChevronRight size={20} className="shrink-0 text-muted-foreground" />
    </button>
  )
}
