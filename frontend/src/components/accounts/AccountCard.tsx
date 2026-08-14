import React from 'react'
import { Landmark, Wallet, CreditCard, PiggyBank, Edit2, Trash2 } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatCurrency } from '@/utils/formatters'
import { ACCOUNT_TYPE_LABELS } from '@/utils/constants'
import type { Account } from '@/types'

export interface AccountCardProps {
  account: Account
  onEdit: (account: Account) => void
  onDelete: (id: string) => void
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onEdit, onDelete }) => {
  const getAccountIcon = () => {
    switch (account.account_type) {
      case 'CASH':
        return <Wallet className="w-5 h-5" />
      case 'BANK':
        return <Landmark className="w-5 h-5" />
      case 'CREDIT_CARD':
        return <CreditCard className="w-5 h-5" />
      case 'SAVINGS':
        return <PiggyBank className="w-5 h-5" />
      default:
        return <Landmark className="w-5 h-5" />
    }
  }

  const currentBal = parseFloat(account.current_balance)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0">
              {getAccountIcon()}
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">{account.name}</h4>
              <p className="text-xs text-gray-400">
                {ACCOUNT_TYPE_LABELS[account.account_type] || account.account_type} • {account.currency}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
              account.is_active
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {account.is_active ? 'Active' : 'Archived'}
          </span>
        </div>

        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Current Balance</p>
          <h3
            className={`text-2xl font-extrabold mt-1 tracking-tight ${
              currentBal < 0 ? 'text-red-600' : 'text-gray-900'
            }`}
          >
            {formatCurrency(account.current_balance, account.currency)}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Opening: {formatCurrency(account.opening_balance, account.currency)}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit(account)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => onDelete(account.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </Card>
  )
}
