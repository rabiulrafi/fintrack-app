import React from 'react'
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Calendar } from 'lucide-react'
import { StatCard } from '../ui/StatCard'
import { formatCurrency } from '@/utils/formatters'
import type { DashboardSummary } from '@/types'

export interface SummaryCardsProps {
  summary?: DashboardSummary
  isLoading?: boolean
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-3"></div>
            <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800/60 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Total Balance"
        value={formatCurrency(summary?.total_balance)}
        subtitle="Across all accounts"
        icon={<Wallet className="w-5 h-5" />}
        variant="default"
      />
      <StatCard
        title="Total Income"
        value={formatCurrency(summary?.total_income)}
        subtitle="All recorded income"
        icon={<TrendingUp className="w-5 h-5" />}
        variant="income"
      />
      <StatCard
        title="Total Expense"
        value={formatCurrency(summary?.total_expense)}
        subtitle="All recorded expenses"
        icon={<TrendingDown className="w-5 h-5" />}
        variant="expense"
      />
      <StatCard
        title="Net Savings"
        value={formatCurrency(summary?.net_savings)}
        subtitle="Income minus expense"
        icon={<PiggyBank className="w-5 h-5" />}
        variant="savings"
      />
      <StatCard
        title="This Month (In)"
        value={formatCurrency(summary?.current_month_income)}
        subtitle="Income this month"
        icon={<Calendar className="w-5 h-5" />}
        variant="income"
      />
      <StatCard
        title="This Month (Out)"
        value={formatCurrency(summary?.current_month_expense)}
        subtitle="Expense this month"
        icon={<Calendar className="w-5 h-5" />}
        variant="expense"
      />
    </div>
  )
}
