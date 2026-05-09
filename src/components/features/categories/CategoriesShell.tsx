'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { AnimatedSection } from '@/components/ui/animated-section'
import { CategoryList } from './CategoryList'
import { AddCategoryForm } from './AddCategoryForm'
import type { Category } from '@/lib/types/database'

interface CategoriesShellProps {
  categories: Category[]
}

export function CategoriesShell({ categories }: CategoriesShellProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)

  const handleEdit = (category: Category) => {
    setEditCategory(category)
    setSheetOpen(true)
  }

  const handleClose = () => {
    setSheetOpen(false)
    setEditCategory(null)
  }

  const handleNew = () => {
    setEditCategory(null)
    setSheetOpen(true)
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-6">
      <AnimatedSection delay={0}>
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
            Kategorien
          </h2>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Aktueller Monat
          </span>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <CategoryList categories={categories} onEdit={handleEdit} />
      </AnimatedSection>

      {/* FAB */}
      <button
        onClick={handleNew}
        className="fixed bottom-28 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary-foreground shadow-lg transition-all active:scale-90"
      >
        <Plus size={24} />
      </button>

      <BottomSheet open={sheetOpen} onClose={handleClose}>
        <AddCategoryForm category={editCategory} onDone={handleClose} />
      </BottomSheet>
    </div>
  )
}
