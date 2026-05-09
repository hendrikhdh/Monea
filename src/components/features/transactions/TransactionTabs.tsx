import Link from 'next/link'

interface TransactionTabsProps {
  active: 'single' | 'recurring'
}

export function TransactionTabs({ active }: TransactionTabsProps) {
  return (
    <div className="flex gap-2 rounded-xl bg-surface-container p-1">
      <Link
        href="/transactions"
        className={`flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-all ${
          active === 'single'
            ? 'bg-secondary text-secondary-foreground'
            : 'text-muted-foreground'
        }`}
      >
        Einmalig
      </Link>
      <Link
        href="/transactions?tab=recurring"
        className={`flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-all ${
          active === 'recurring'
            ? 'bg-secondary text-secondary-foreground'
            : 'text-muted-foreground'
        }`}
      >
        Wiederkehrend
      </Link>
    </div>
  )
}
