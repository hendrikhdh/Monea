'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'

export function Header() {
  const { user } = useAuth()

  const initials = user?.user_metadata?.name
    ? user.user_metadata.name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between bg-background/70 px-6 backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          aria-label="Einstellungen"
          className="avatar-gradient flex h-10 w-10 items-center justify-center rounded-full font-heading text-sm font-bold text-secondary-foreground shadow-sm transition-transform active:scale-95"
        >
          {initials}
        </Link>
        <span className="font-display text-2xl tracking-tight text-foreground">
          Monéa
        </span>
      </div>
    </header>
  )
}
