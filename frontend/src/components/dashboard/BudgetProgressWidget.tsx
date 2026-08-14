import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { formatCurrency } from '@/utils/formatters'
import type { BudgetWithSpending } from '@/types'

export interface BudgetProgressWidgetProps {
  budgets: BudgetWithSpending[]
  isLoading?: boolean
}

export const BudgetProgressWidget: React.FC<BudgetProgressWidgetProps> = ({
  budgets,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card title="Budget Overview" subtitle="Monthly progress">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-2 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (!budgets || budgets.length === 0) {
    return (
      <Card
        title="Budget Overview"
        subtitle="Monthly progress"
        action={
          <Link
            to="/budgets"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            Create Budget <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        <EmptyState
          title="No budgets set"
          description="Create budgets for categories to monitor spending goals."
        />
      </Card>
    )
  }

  return (
    <Card
      title="Budget Overview"
      subtitle="Monthly spending vs targets"
      action={
        <Link
          to="/budgets"
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
        {budgets.slice(0, 5).map((budget) => {
          const percentage = budget.percentage || 0
          const isOverBudget = percentage >= 100
          const isWarning = percentage >= 80 && percentage < 100

          let progressBarColor = 'bg-primary-600'
          if (isOverBudget) progressBarColor = 'bg-red-600'
          else if (isWarning) progressBarColor = 'bg-amber-500'

          return (
            <div key={budget.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-800">
                    {budget.category?.name || 'Category'}
                  </span>
                  {isOverBudget && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                      <AlertCircle className="w-3 h-3" /> Over
                    </span>
                  )}
                  {isWarning && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      Near limit
                    </span>
                  )}
                </div>
                <div className="text-gray-500">
                  <span className="font-medium text-gray-900">
                    {formatCurrency(budget.spent)}
                  </span>{' '}
                  / {formatCurrency(budget.amount)}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${progressBarColor}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400">
                <span>{percentage}% used</span>
                <span>
                  {isOverBudget
                    ? `Over by ${formatCurrency(Math.abs(parseFloat(budget.remaining)))}`
                    : `${formatCurrency(budget.remaining)} left`}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
