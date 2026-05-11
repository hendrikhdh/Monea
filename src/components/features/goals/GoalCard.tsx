import { getGoalImageUrl } from '@/lib/supabase/goalImage'
import type { Goal } from '@/lib/types/database'
import { cn } from '@/lib/utils'

interface GoalCardProps {
  goal: Goal
  onClick?: () => void
}

function getStatusLabel(percentage: number) {
  if (percentage >= 100) return 'Erreicht'
  if (percentage > 0) return 'In Progress'
  return 'Starting'
}

function getStatusColor(percentage: number) {
  if (percentage >= 100) return 'bg-success/90'
  if (percentage > 0) return 'bg-primary-container/90'
  return 'bg-muted-foreground/70'
}

function getAspectClass(aspect: string | null) {
  switch (aspect) {
    case '1:1': return 'aspect-square max-h-[55vw]'
    case '4:3': return 'aspect-[4/3] max-h-[50vw]'
    case '16:9': return 'aspect-[16/9] max-h-[45vw]'
    case '21:9': return 'aspect-[21/9] max-h-[40vw]'
    default: return 'aspect-[16/9] max-h-[45vw]'
  }
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const percentage = goal.target_amount > 0
    ? Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100)
    : 0

  const format = (v: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)

  const imageUrl = goal.image_path ? getGoalImageUrl(goal.image_path) : null
  const hasImage = !!imageUrl

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex w-full flex-col justify-end overflow-hidden rounded-[2rem_1rem_2rem_2.5rem] text-left transition-all active:scale-[0.97]',
        hasImage ? getAspectClass(goal.image_aspect) : 'h-56 bg-surface-container'
      )}
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Background image */}
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      {/* Dark gradient overlay */}
      <div className={cn(
        'absolute inset-0',
        hasImage
          ? 'bg-gradient-to-t from-black/80 via-black/30 to-transparent'
          : 'bg-gradient-to-t from-black/10 to-transparent'
      )} />

      {/* Status badge */}
      <div className="absolute right-4 top-4">
        <span className={cn(
          'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white',
          getStatusColor(percentage)
        )}>
          {getStatusLabel(percentage)}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        <h3 className={cn(
          'font-display text-2xl tracking-tight',
          hasImage ? 'text-white' : 'text-foreground'
        )}>
          {goal.name}
        </h3>
        <p className={cn(
          'mt-1 font-display text-sm tabular-nums',
          hasImage ? 'text-white/70' : 'text-muted-foreground'
        )}>
          {format(goal.current_amount)} von {format(goal.target_amount)}
        </p>

        {/* Progress bar */}
        <div className={cn(
          'mt-3 h-2 w-full overflow-hidden rounded-full',
          hasImage ? 'bg-white/20' : 'bg-border'
        )}>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              percentage >= 100 ? 'bg-success' : hasImage ? 'bg-white' : 'bg-primary'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </button>
  )
}
