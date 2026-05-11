const eurFormatter2 = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const eurFormatter0 = new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 0,
})

const eurCurrencyFormatter2 = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
})

export function formatCurrency(value: number): string {
  return eurFormatter2.format(value)
}

export function formatCurrencyShort(value: number): string {
  return eurFormatter0.format(value)
}

export function formatCurrencyWithSymbol(value: number): string {
  return eurCurrencyFormatter2.format(value)
}
