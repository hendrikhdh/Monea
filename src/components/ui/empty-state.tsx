'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'soft' | 'feature'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  cta?:
    | { label: string; href: string }
    | { label: string; onClick: () => void }
  variant?: Variant
  className?: string
}

const BLOB_SHAPE = 'rounded-[2.5rem_1.25rem_3rem_1.75rem]'

export function EmptyState({
  icon: Icon,
  title,
  description,
  cta,
  variant = 'soft',
  className,
}: EmptyStateProps) {
  const isFeature = variant === 'feature'

  return (
    <div
      className={cn(
        BLOB_SHAPE,
        'flex flex-col items-center justify-center text-center',
        isFeature
          ? 'gap-5 bg-secondary-container/60 px-8 py-14'
          : 'gap-4 bg-surface-container-low px-6 py-10',
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full',
            isFeature
              ? 'h-16 w-16 bg-secondary-container text-secondary-foreground'
              : 'h-12 w-12 bg-secondary/60 text-secondary-foreground'
          )}
        >
          <Icon size={isFeature ? 28 : 22} strokeWidth={1.75} />
        </div>
      )}

      <div className="space-y-1.5">
        <h3
          className={cn(
            'font-heading font-bold text-foreground',
            isFeature ? 'text-xl' : 'text-base'
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              'mx-auto max-w-xs text-muted-foreground',
              isFeature ? 'text-sm' : 'text-xs'
            )}
          >
            {description}
          </p>
        )}
      </div>

      {cta && 'href' in cta && (
        <Link
          href={cta.href}
          className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-primary-container px-6 text-sm font-semibold text-primary-foreground shadow-md transition-all active:scale-95"
        >
          {cta.label}
        </Link>
      )}
      {cta && 'onClick' in cta && (
        <button
          type="button"
          onClick={cta.onClick}
          className="mt-1 inline-flex h-11 items-center justify-center rounded-full bg-primary-container px-6 text-sm font-semibold text-primary-foreground shadow-md transition-all active:scale-95"
        >
          {cta.label}
        </button>
      )}
    </div>
  )
}
