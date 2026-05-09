'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

export function Header() {
  const { user } = useAuth()

  const initials = user?.user_metadata?.name
    ? user.user_metadata.name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between rounded-b-[3rem] bg-background/70 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-heading text-sm font-bold text-secondary-foreground transition-transform active:scale-95"
        >
          {initials}
        </Link>
        <span className="font-display text-2xl tracking-tight text-foreground">
          Monéa
        </span>
      </div>
      <button className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-accent active:scale-95">
        <Bell size={22} strokeWidth={1.5} className="text-foreground" />
      </button>
    </header>
  )
}
