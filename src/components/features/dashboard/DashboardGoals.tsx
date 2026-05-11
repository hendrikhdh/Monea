'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { GoalCard } from '@/components/features/goals/GoalCard'
import { AddGoalForm } from '@/components/features/goals/AddGoalForm'
import type { Goal } from '@/lib/types/database'

interface DashboardGoalsProps {
  goals: Goal[]
}

export function DashboardGoals({ goals }: DashboardGoalsProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editGoal, setEditGoal] = useState<Goal | null>(null)

  const activeGoals = goals
    .filter((g) => g.target_amount > 0 && g.current_amount > 0 && g.current_amount < g.target_amount)
    .sort((a, b) => b.current_amount / b.target_amount - a.current_amount / a.target_amount)
    .slice(0, 3)

  if (activeGoals.length === 0) return null

  const handleEdit = (goal: Goal) => {
    setEditGoal(goal)
    setSheetOpen(true)
  }

  const handleClose = () => {
    setSheetOpen(false)
    setEditGoal(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h2 className="font-heading text-xl font-bold text-foreground">Sparziele</h2>
        <Link
          href="/goals"
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Alle anzeigen
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {activeGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onClick={() => handleEdit(goal)} />
        ))}
      </div>

      <BottomSheet open={sheetOpen} onClose={handleClose}>
        <AddGoalForm goal={editGoal} onDone={handleClose} />
      </BottomSheet>
    </div>
  )
}
