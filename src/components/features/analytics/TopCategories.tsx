import { ICON_MAP } from '@/components/features/categories/iconMap'

interface TopCategoriesProps {
  data: { name: string; color: string; icon: string; total: number }[]
}

export function TopCategories({ data }: TopCategoriesProps) {
  const format = (v: number) =>
    new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(v)

  const max = data.length > 0 ? data[0].total : 1

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Keine Ausgaben in diesem Monat</p>
    )
  }

  return (
    <div className="space-y-3">
      {data.slice(0, 5).map((item, i) => {
        const Icon = ICON_MAP[item.icon]
        const width = Math.max(8, Math.round((item.total / max) * 100))
        return (
          <div key={item.name} className="flex items-center gap-3">
            <span className="w-5 text-center text-xs font-semibold text-muted-foreground">
              {i + 1}
            </span>
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: item.color + '20' }}
            >
              {Icon && <Icon size={16} style={{ color: item.color }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <span className="truncate text-sm font-medium">{item.name}</span>
                <span className="ml-2 text-sm font-semibold">{format(item.total)} €</span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-primary/10">
                <div
                  className="h-1 rounded-full"
                  style={{ width: `${width}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
