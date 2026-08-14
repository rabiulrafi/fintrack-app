import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { Transaction } from '@/types'

export interface RecentTransactionsListProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({
  transactions,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card title="Recent Transactions" subtitle="Latest account activity">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-100 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card
        title="Recent Transactions"
        subtitle="Latest account activity"
        action={
          <Link
            to="/transactions"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            Add Transaction <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        <EmptyState
          title="No transactions yet"
          description="Start tracking your expenses and incomes to see recent activity."
        />
      </Card>
    )
  }

  return (
    <Card
      title="Recent Transactions"
      subtitle="Latest account activity"
      action={
        <Link
          to="/transactions"
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
      noPadding
    >
      <div className="divide-y divide-gray-100">
        {transactions.slice(0, 7).map((txn) => {
          const isIncome = txn.transaction_type === 'INCOME'

          return (
            <div
              key={txn.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50/70 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isIncome
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {isIncome ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {txn.description || txn.category?.name || 'Transaction'}
                    </span>
                    {txn.category?.name && (
                      <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {txn.category.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span>{formatDate(txn.transaction_date)}</span>
                    {txn.account && (
                      <>
                        <span>•</span>
                        <span>{txn.account.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-sm font-bold ${
                    isIncome ? 'text-green-600' : 'text-gray-900'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(txn.amount, txn.currency)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
