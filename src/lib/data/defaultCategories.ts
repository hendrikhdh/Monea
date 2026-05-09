export const DEFAULT_CATEGORIES = [
  { name: 'Lebensmittel', icon: 'ShoppingCart', color: '#4CAF50', type: 'expense' as const },
  { name: 'Miete', icon: 'Home', color: '#795548', type: 'expense' as const },
  { name: 'Gehalt', icon: 'Banknote', color: '#2196F3', type: 'income' as const },
  { name: 'Transport', icon: 'Bus', color: '#FF9800', type: 'expense' as const },
  { name: 'Unterhaltung', icon: 'Music', color: '#E91E63', type: 'expense' as const },
  { name: 'Essen gehen', icon: 'Utensils', color: '#FF5722', type: 'expense' as const },
  { name: 'Gesundheit', icon: 'Stethoscope', color: '#00BCD4', type: 'expense' as const },
  { name: 'Shopping', icon: 'ShoppingBag', color: '#9C27B0', type: 'expense' as const },
  { name: 'Abonnements', icon: 'Wifi', color: '#607D8B', type: 'expense' as const },
  { name: 'Geschenke', icon: 'Gift', color: '#F44336', type: 'expense' as const },
] as const
