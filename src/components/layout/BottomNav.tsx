'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, BarChart3, Trophy } from 'lucide-react'
import { ORGANIC_SHAPES } from '@/components/features/categories/organicShapes'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, shape: ORGANIC_SHAPES[0] },
  { href: '/transactions', label: 'Transaktionen', icon: Receipt, shape: ORGANIC_SHAPES[2] },
  { href: '/analytics', label: 'Analyse', icon: BarChart3, shape: ORGANIC_SHAPES[5] },
  { href: '/goals', label: 'Ziele', icon: Trophy, shape: ORGANIC_SHAPES[8] },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-24 items-end justify-around bg-background/70 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      {navItems.map(({ href, label, icon: Icon, shape }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={cn(
              '-mb-3 flex h-14 w-14 items-center justify-center transition-[background-color,color,transform] duration-300 active:scale-90',
              isActive
                ? cn('bg-secondary text-secondary-foreground', shape)
                : 'rounded-full text-muted-foreground hover:scale-110'
            )}
          >
            <Icon size={26} strokeWidth={isActive ? 2 : 1.5} />
          </Link>
        )
      })}
    </nav>
  )
}
