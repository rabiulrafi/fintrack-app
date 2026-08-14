import React from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { Transaction } from '@/types'

export interface TransactionRowProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  const isIncome = transaction.transaction_type === 'INCOME'

  return (
    <tr className="hover:bg-gray-50/80 transition-colors group">
      {/* Date */}
      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-500 font-medium">
        {formatDate(transaction.transaction_date)}
      </td>

      {/* Description & Reference */}
      <td className="px-4 py-3.5">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {transaction.description || 'No description'}
          </span>
          {transaction.reference_number && (
            <span className="text-[11px] text-gray-400">
              Ref: {transaction.reference_number}
            </span>
          )}
          {transaction.notes && (
            <span className="text-[11px] text-gray-400 italic truncate max-w-xs">
              {transaction.notes}
            </span>
          )}
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        {transaction.category ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
            {transaction.category.icon && <span>{transaction.category.icon}</span>}
            <span>{transaction.category.name}</span>
          </span>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>

      {/* Account */}
      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-600 font-medium">
        {transaction.account?.name || '-'}
      </td>

      {/* Type */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
            isIncome ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {transaction.transaction_type}
        </span>
      </td>

      {/* Amount */}
      <td className="px-4 py-3.5 whitespace-nowrap text-right text-sm font-bold">
        <span className={isIncome ? 'text-green-600' : 'text-gray-900'}>
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount, transaction.currency)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5 whitespace-nowrap text-right text-xs">
        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit Transaction"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Transaction"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}
