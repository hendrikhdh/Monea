'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface SpendingDonutProps {
  data: { name: string; color: string; total: number }[]
}

export function SpendingDonut({ data }: SpendingDonutProps) {
  const format = (v: number) =>
    new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(v)

  const total = data.reduce((sum, d) => sum + d.total, 0)

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Keine Ausgaben in diesem Monat
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-48 w-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted-foreground">Gesamt</span>
          <span className="font-heading text-lg font-bold">{format(total)} €</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid w-full grid-cols-2 gap-2">
        {data.slice(0, 6).map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate text-xs text-on-surface-variant">{entry.name}</span>
            <span className="ml-auto text-xs font-semibold">{format(entry.total)} €</span>
          </div>
        ))}
      </div>
    </div>
  )
}
