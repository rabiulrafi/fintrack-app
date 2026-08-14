import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart'
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart'
import { BudgetProgressWidget } from '@/components/dashboard/BudgetProgressWidget'
import { RecentTransactionsList } from '@/components/dashboard/RecentTransactionsList'
import { AccountBalanceWidget } from '@/components/dashboard/AccountBalanceWidget'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { useDashboard } from '@/hooks/useDashboard'
import { useBudgets } from '@/hooks/useBudgets'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { useTransactions } from '@/hooks/useTransactions'
import { useAuthStore } from '@/stores/authStore'
import type { TransactionCreate } from '@/types'

export const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user)
  const [period, setPeriod] = useState<
    'today' | 'this_week' | 'this_month' | 'last_month' | 'this_year' | 'custom'
  >('this_month')
  const [startDate, setStartDate] = useState<string | undefined>()
  const [endDate, setEndDate] = useState<string | undefined>()
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)

  // Compute dates based on period
  const getDateRange = () => {
    const now = new Date()
    if (period === 'today') {
      const todayStr = now.toISOString().slice(0, 10)
      return { from: todayStr, to: todayStr }
    }
    if (period === 'this_week') {
      const first = now.getDate() - now.getDay()
      const firstDay = new Date(now.setDate(first)).toISOString().slice(0, 10)
      const lastDay = new Date().toISOString().slice(0, 10)
      return { from: firstDay, to: lastDay }
    }
    if (period === 'this_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)
      return { from: firstDay, to: lastDay }
    }
    if (period === 'last_month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10)
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10)
      return { from: firstDay, to: lastDay }
    }
    if (period === 'this_year') {
      const firstDay = new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10)
      const lastDay = new Date(now.getFullYear(), 11, 31).toISOString().slice(0, 10)
      return { from: firstDay, to: lastDay }
    }
    return { from: startDate, to: endDate }
  }

  const { from: dateFrom, to: dateTo } = getDateRange()

  const { dashboardData, isLoading } = useDashboard(dateFrom, dateTo)
  const { budgets, isLoading: isBudgetsLoading } = useBudgets()
  const { accounts } = useAccounts()
  const { categories } = useCategories()
  const { createTransaction, isCreating } = useTransactions()

  const handleAddTransaction = async (data: TransactionCreate) => {
    await createTransaction(data)
    setIsAddTransactionOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Welcome & Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Welcome back, {user?.full_name || 'User'} 👋
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Here is your financial summary and recent spending trends.
          </p>
        </div>
        <Button
          onClick={() => setIsAddTransactionOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          size="md"
        >
          Add Transaction
        </Button>
      </div>

      {/* Filter Tabs */}
      <DashboardFilters
        period={period}
        startDate={startDate}
        endDate={endDate}
        onPeriodChange={setPeriod}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

      {/* Summary KPI Cards */}
      <SummaryCards summary={dashboardData?.summary} isLoading={isLoading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <IncomeExpenseChart
            data={dashboardData?.monthly_chart || []}
            isLoading={isLoading}
          />
        </div>
        <div>
          <CategoryPieChart
            data={dashboardData?.category_expenses || []}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Second Row: Budgets & Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BudgetProgressWidget budgets={budgets} isLoading={isBudgetsLoading} />
        </div>
        <div>
          <AccountBalanceWidget
            accounts={dashboardData?.account_balances || []}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentTransactionsList
        transactions={dashboardData?.recent_transactions || []}
        isLoading={isLoading}
      />

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        title="Add Transaction"
        description="Record a new transaction to your account"
      >
        <TransactionForm
          accounts={accounts}
          categories={categories}
          onSubmit={handleAddTransaction}
          onCancel={() => setIsAddTransactionOpen(false)}
          isLoading={isCreating}
        />
      </Modal>
    </div>
  )
}
