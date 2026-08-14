import React, { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { BudgetCard } from '@/components/budgets/BudgetCard'
import { BudgetForm } from '@/components/budgets/BudgetForm'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { useBudgets } from '@/hooks/useBudgets'
import { useCategories } from '@/hooks/useCategories'
import { getMonthName } from '@/utils/formatters'
import type { BudgetWithSpending, BudgetCreate } from '@/types'

export const Budgets: React.FC = () => {
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  const {
    budgets,
    isLoading,
    createBudget,
    isCreating,
    updateBudget,
    isUpdating,
    deleteBudget,
    isDeleting,
  } = useBudgets(selectedMonth, selectedYear)

  const { categories } = useCategories('EXPENSE')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<BudgetWithSpending | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12)
      setSelectedYear((y) => y - 1)
    } else {
      setSelectedMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1)
      setSelectedYear((y) => y + 1)
    } else {
      setSelectedMonth((m) => m + 1)
    }
  }

  const handleCreate = async (data: BudgetCreate) => {
    await createBudget(data)
    setIsCreateOpen(false)
  }

  const handleUpdate = async (data: BudgetCreate) => {
    if (!editingBudget) return
    await updateBudget({ id: editingBudget.id, data: { amount: data.amount } })
    setEditingBudget(null)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    await deleteBudget(deletingId)
    setDeletingId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Budgets</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Set and track spending limits by category to meet your savings goals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month/Year selector */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-gray-800">
              {getMonthName(selectedMonth)} {selectedYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Set Budget
          </Button>
        </div>
      </div>

      {/* Grid of Budgets */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="card">
          <EmptyState
            title={`No budgets set for ${getMonthName(selectedMonth)} ${selectedYear}`}
            description="Create a category spending target to keep your expenses in check."
            action={
              <Button onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Set Budget
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              budget={b}
              onEdit={setEditingBudget}
              onDelete={setDeletingId}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Set Monthly Budget"
        description={`Configure a spending limit for ${getMonthName(selectedMonth)} ${selectedYear}`}
      >
        <BudgetForm
          categories={categories}
          currentMonth={selectedMonth}
          currentYear={selectedYear}
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          isLoading={isCreating}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingBudget}
        onClose={() => setEditingBudget(null)}
        title="Edit Budget"
        description="Update spending limit"
      >
        {editingBudget && (
          <BudgetForm
            categories={categories}
            initialData={editingBudget}
            currentMonth={selectedMonth}
            currentYear={selectedYear}
            onSubmit={handleUpdate}
            onCancel={() => setEditingBudget(null)}
            isLoading={isUpdating}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Budget"
        message="Are you sure you want to remove this budget target? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  )
}
