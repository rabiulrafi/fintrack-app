import React from 'react'
import { AlertCircle, Edit2, Trash2 } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatCurrency } from '@/utils/formatters'
import type { BudgetWithSpending } from '@/types'

export interface BudgetCardProps {
  budget: BudgetWithSpending
  onEdit: (budget: BudgetWithSpending) => void
  onDelete: (id: string) => void
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onEdit, onDelete }) => {
  const percentage = budget.percentage || 0
  const isOverBudget = percentage >= 100
  const isNearLimit = percentage >= 80 && percentage < 100

  let statusBadge = null
  let progressColor = 'bg-primary-600'

  if (isOverBudget) {
    progressColor = 'bg-red-600'
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
        <AlertCircle className="w-3 h-3" /> Over Budget
      </span>
    )
  } else if (isNearLimit) {
    progressColor = 'bg-amber-500'
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
        Near Limit (80%+)
      </span>
    )
  } else {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
        On Track
      </span>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{budget.category?.icon || '📁'}</span>
            <div>
              <h4 className="text-base font-bold text-gray-900">
                {budget.category?.name || 'Category'}
              </h4>
              <p className="text-xs text-gray-400">
                {new Date(budget.year, budget.month - 1).toLocaleString('default', {
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          {statusBadge}
        </div>

        {/* Progress Values */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <p className="text-xs text-gray-500 font-medium">Spent</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(budget.spent)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium">Budget</p>
            <p className="text-lg font-bold text-gray-700">{formatCurrency(budget.amount)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-semibold">{percentage}% used</span>
            <span>
              {isOverBudget
                ? `Exceeded by ${formatCurrency(Math.abs(parseFloat(budget.remaining)))}`
                : `${formatCurrency(budget.remaining)} remaining`}
            </span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(budget)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </Card>
  )
}
