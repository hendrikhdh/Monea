interface BalanceCardProps {
  balance: number
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(balance)

  return (
    <section className="relative overflow-hidden rounded-[3rem_1rem_4rem_3rem] bg-gradient-to-br from-primary to-primary-container p-10 text-primary-foreground shadow-xl">
      {/* Decorative blur blob */}
      <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-muted-foreground opacity-20 blur-3xl" />

      <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-secondary">
        Gesamtsaldo
      </p>
      <h1 className="mt-2 font-display text-5xl font-normal leading-tight">
        {formatted}
      </h1>
    </section>
  )
}
