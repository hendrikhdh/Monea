'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, BarChart3, Trophy, LogOut } from 'lucide-react'
import { ORGANIC_SHAPES } from '@/components/features/categories/organicShapes'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'
import { SidebarBlobs } from './SidebarBlobs'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, shape: ORGANIC_SHAPES[0] },
  { href: '/transactions', label: 'Transaktionen', icon: Receipt, shape: ORGANIC_SHAPES[2] },
  { href: '/analytics', label: 'Analyse', icon: BarChart3, shape: ORGANIC_SHAPES[5] },
  { href: '/goals', label: 'Ziele', icon: Trophy, shape: ORGANIC_SHAPES[8] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const name =
    typeof user?.user_metadata?.name === 'string' ? user.user_metadata.name : ''
  const email = user?.email ?? ''
  const initials = name
    ? name.charAt(0).toUpperCase()
    : email.charAt(0).toUpperCase() || '?'

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col overflow-hidden border-r border-sidebar-border/40 bg-sidebar lg:flex">
      <SidebarBlobs />
      <div className="px-8 pt-10 pb-12">
        <Link
          href="/"
          className="font-display text-4xl tracking-tight text-sidebar-foreground lowercase"
        >
          Monéa
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {navItems.map(({ href, label, icon: Icon, shape }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              prefetch
              className={cn(
                'group flex items-center gap-4 rounded-2xl px-3 py-2.5 font-sans text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                isActive
                  ? 'bg-sidebar-accent/40 font-semibold text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center transition-colors',
                  isActive
                    ? cn('bg-secondary text-secondary-foreground', shape)
                    : 'rounded-full'
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              </span>
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border/40 p-4">
        <div className="flex items-center gap-3 px-1 py-1">
          <Link
            href="/settings"
            aria-label="Einstellungen"
            className="avatar-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold text-secondary-foreground transition-transform active:scale-95"
          >
            {initials}
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-sm font-medium text-sidebar-foreground">
              {name || 'Konto'}
            </p>
            <p className="truncate font-sans text-xs text-muted-foreground">
              {email}
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            aria-label="Abmelden"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}
