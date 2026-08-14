import React from 'react'
import { TransactionRow } from './TransactionRow'
import { Pagination } from '../ui/Pagination'
import { EmptyState } from '../ui/EmptyState'
import { Button } from '../ui/Button'
import { Plus } from 'lucide-react'
import type { Transaction } from '@/types'

export interface TransactionTableProps {
  transactions: Transaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  isLoading?: boolean
  onPageChange: (page: number) => void
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  onAddNew?: () => void
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  total,
  page,
  pageSize,
  totalPages,
  isLoading,
  onPageChange,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  if (isLoading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse h-12 bg-gray-100 rounded-lg w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <EmptyState
          title="No transactions found"
          description="Try adjusting your filters or record a new income/expense transaction."
          action={
            onAddNew ? (
              <Button onClick={onAddNew} size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Add Transaction
              </Button>
            ) : null
          }
        />
      </div>
    )
  }

  return (
    <div className="card overflow-hidden shadow-sm">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Account</th>
              <th>Type</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <TransactionRow
                key={txn.id}
                transaction={txn}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  )
}
