'use client'

import Link, { useLinkStatus } from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, BarChart3, Trophy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ORGANIC_SHAPES } from '@/components/features/categories/organicShapes'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, shape: ORGANIC_SHAPES[0] },
  { href: '/transactions', label: 'Transaktionen', icon: Receipt, shape: ORGANIC_SHAPES[2] },
  { href: '/analytics', label: 'Analyse', icon: BarChart3, shape: ORGANIC_SHAPES[5] },
  { href: '/goals', label: 'Ziele', icon: Trophy, shape: ORGANIC_SHAPES[8] },
]

interface NavIconProps {
  Icon: LucideIcon
  isActive: boolean
}

function NavIcon({ Icon, isActive }: NavIconProps) {
  const { pending } = useLinkStatus()
  return (
    <Icon
      size={26}
      strokeWidth={isActive ? 2 : 1.5}
      className={cn(
        'transition-opacity duration-150',
        pending && !isActive ? 'opacity-50' : 'opacity-100'
      )}
    />
  )
}

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-24 items-start justify-around bg-background/80 pt-2 backdrop-blur-md lg:hidden">
      {navItems.map(({ href, label, icon: Icon, shape }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            prefetch
            aria-label={label}
            className={cn(
              'flex h-14 w-14 items-center justify-center transition-[background-color,color] duration-150 active:scale-90',
              isActive
                ? cn('bg-secondary text-secondary-foreground', shape)
                : 'rounded-full text-muted-foreground'
            )}
          >
            <NavIcon Icon={Icon} isActive={isActive} />
          </Link>
        )
      })}
    </nav>
  )
}
