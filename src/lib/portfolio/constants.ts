import type { PortfolioAccountType } from '@/lib/types/database'

export const ACCOUNT_TYPE_LABELS: Record<PortfolioAccountType, string> = {
  savings: 'Tagesgeld',
  brokerage: 'Depot',
  cash: 'Bargeld',
  other: 'Sonstiges',
}
