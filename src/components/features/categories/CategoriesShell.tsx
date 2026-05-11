'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, ChevronLeft } from 'lucide-react'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { CategoryList } from './CategoryList'
import { CategoryFilters, type CategoryFilterType } from './CategoryFilters'
import { AddCategoryForm } from './AddCategoryForm'
import type { Category } from '@/lib/types/database'

interface CategoriesShellProps {
  categories: Category[]
}

export function CategoriesShell({ categories }: CategoriesShellProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [filter, setFilter] = useState<CategoryFilterType>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return categories
    if (filter === 'income') {
      return categories.filter((c) => c.type === 'income' || c.type === 'both')
    }
    return categories.filter((c) => c.type === 'expense' || c.type === 'both')
  }, [categories, filter])

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
    <div className="mx-auto w-full max-w-2xl px-6 pb-24">
      {/* Sticky header: Back + Title + Filter */}
      <div className="sticky top-20 z-30 -mx-6 -mt-4 space-y-3 bg-background/70 px-6 pb-4 pt-7 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container transition-all active:scale-90"
            aria-label="Zurück"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </Link>
          <h1 className="font-heading text-2xl font-bold text-foreground">Kategorien</h1>
        </div>

        <CategoryFilters active={filter} onChange={setFilter} />
      </div>

      {/* List */}
      <div className="pt-6">
        <CategoryList categories={filtered} onEdit={handleEdit} />
      </div>

      {/* FAB */}
      <button
        onClick={handleNew}
        aria-label="Kategorie hinzufügen"
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
