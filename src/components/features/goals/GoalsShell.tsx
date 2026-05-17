'use client'

import { useState } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { AnimatedSection } from '@/components/ui/animated-section'
import { EmptyState } from '@/components/ui/empty-state'
import { GoalCard } from './GoalCard'
import { AddGoalForm } from './AddGoalForm'
import type { Goal } from '@/lib/types/database'

interface GoalsShellProps {
  goals: Goal[]
}

export function GoalsShell({ goals }: GoalsShellProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editGoal, setEditGoal] = useState<Goal | null>(null)

  const handleEdit = (goal: Goal) => {
    setEditGoal(goal)
    setSheetOpen(true)
  }

  const handleClose = () => {
    setSheetOpen(false)
    setEditGoal(null)
  }

  const handleNew = () => {
    setEditGoal(null)
    setSheetOpen(true)
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-6 lg:max-w-[1400px] lg:px-10">
      <AnimatedSection delay={0}>
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
            Sparziele
          </h2>
        </div>
      </AnimatedSection>

      {goals.length === 0 ? (
        <AnimatedSection delay={0.1}>
          <EmptyState
            icon={Sparkles}
            title="Noch keine Sparziele"
            description="Setze dir ein Ziel — vom Wochenende-Trip bis zur ersten eigenen Wohnung."
            cta={{ label: 'Sparziel anlegen', onClick: handleNew }}
            variant="feature"
          />
        </AnimatedSection>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {goals.map((goal, i) => (
            <AnimatedSection key={goal.id} delay={0.1 + i * 0.1}>
              <GoalCard goal={goal} onClick={() => handleEdit(goal)} />
            </AnimatedSection>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={handleNew}
        className="fixed bottom-28 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary-foreground shadow-lg transition-all active:scale-90"
      >
        <Plus size={24} />
      </button>

      <BottomSheet open={sheetOpen} onClose={handleClose}>
        <AddGoalForm goal={editGoal} onDone={handleClose} />
      </BottomSheet>
    </div>
  )
}
