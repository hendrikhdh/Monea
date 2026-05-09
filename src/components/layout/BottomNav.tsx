'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transaktionen', icon: Receipt },
  { href: '/goals', label: 'Ziele', icon: Trophy },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-24 items-center justify-around rounded-t-[3rem] bg-background/70 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 active:scale-90',
              isActive
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:scale-110'
            )}
          >
            <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
