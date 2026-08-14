import React from 'react'
import { Link } from 'react-router-dom'
import { Landmark, ArrowRight } from 'lucide-react'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { formatCurrency } from '@/utils/formatters'
import { ACCOUNT_TYPE_LABELS } from '@/utils/constants'
import type { AccountBalance, AccountType } from '@/types'

export interface AccountBalanceWidgetProps {
  accounts: AccountBalance[]
  isLoading?: boolean
}

export const AccountBalanceWidget: React.FC<AccountBalanceWidgetProps> = ({
  accounts,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card title="Accounts" subtitle="Balance breakdown">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Card
        title="Accounts"
        subtitle="Balance breakdown"
        action={
          <Link
            to="/accounts"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            Add Account <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        <EmptyState
          title="No accounts found"
          description="Create accounts like Cash or Bank to start tracking your funds."
        />
      </Card>
    )
  }

  return (
    <Card
      title="Accounts"
      subtitle="Balance breakdown"
      action={
        <Link
          to="/accounts"
          className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          Manage <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
        {accounts.map((acct) => (
          <div
            key={acct.account_id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{acct.account_name}</p>
                <p className="text-[11px] text-gray-400">
                  {ACCOUNT_TYPE_LABELS[acct.account_type as AccountType] || acct.account_type}
                </p>
              </div>
            </div>
            <span
              className={`text-sm font-bold ${
                acct.balance < 0 ? 'text-red-600' : 'text-gray-900'
              }`}
            >
              {formatCurrency(acct.balance)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
