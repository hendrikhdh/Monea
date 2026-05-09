'use client'

import { Search } from 'lucide-react'

interface TransactionSearchProps {
  value: string
  onChange: (value: string) => void
}

export function TransactionSearch({ value, onChange }: TransactionSearchProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
        <Search size={20} className="text-on-surface-variant" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Suchen nach 'Kaffee' oder 'Yoga'..."
        className="h-14 w-full rounded-full border-none bg-surface-container-low pl-14 pr-6 font-medium text-foreground placeholder:text-on-surface-variant transition-all focus:ring-2 focus:ring-secondary"
      />
    </div>
  )
}
