import { cn } from '@/lib/utils'

interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  className?: string
  trackClassName?: string
  progressClassName?: string
  children?: React.ReactNode
}

export function ProgressRing({
  percentage,
  size = 64,
  strokeWidth = 6,
  className,
  trackClassName = 'text-outline-variant/20',
  progressClassName = 'text-muted-foreground',
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  const center = size / 2

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg width={size} height={size}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('origin-center -rotate-90', progressClassName)}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}
