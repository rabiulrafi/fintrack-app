import React, { useState } from 'react'
import { Plus, Download, FileSpreadsheet, FileText } from 'lucide-react'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useTransactions } from '@/hooks/useTransactions'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { exportsApi } from '@/api/exports'
import toast from 'react-hot-toast'
import type { Transaction, TransactionCreate, TransactionFilter } from '@/types'

export const Transactions: React.FC = () => {
  const [filters, setFilters] = useState<TransactionFilter>({
    page: 1,
    page_size: 15,
  })

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const {
    transactions,
    total,
    page,
    pageSize,
    totalPages,
    isLoading,
    createTransaction,
    isCreating,
    updateTransaction,
    isUpdating,
    deleteTransaction,
    isDeleting,
  } = useTransactions(filters)

  const { accounts } = useAccounts()
  const { categories } = useCategories()

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  const handleResetFilters = () => {
    setFilters({ page: 1, page_size: 15 })
  }

  const handleCreate = async (data: TransactionCreate) => {
    await createTransaction(data)
    setIsCreateModalOpen(false)
  }

  const handleUpdate = async (data: TransactionCreate) => {
    if (!editingTransaction) return
    await updateTransaction({ id: editingTransaction.id, data })
    setEditingTransaction(null)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    await deleteTransaction(deletingId)
    setDeletingId(null)
  }

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      setIsExporting(true)
      if (format === 'csv') await exportsApi.exportCSV(filters)
      else if (format === 'excel') await exportsApi.exportExcel(filters)
      else if (format === 'pdf') await exportsApi.exportPDF(filters)
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch {
      toast.error('Failed to export transactions')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Transactions</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            View, filter, edit, and export all your income and expense transactions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export options */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors flex items-center gap-1"
              title="Export as CSV"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors flex items-center gap-1"
              title="Export as Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-green-600" /> Excel
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="px-2.5 py-1 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors flex items-center gap-1"
              title="Export as PDF"
            >
              <FileText className="w-3.5 h-3.5 text-red-600" /> PDF
            </button>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      <TransactionFilters
        filters={filters}
        accounts={accounts}
        categories={categories}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Transactions Table */}
      <TransactionTable
        transactions={transactions}
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onEdit={setEditingTransaction}
        onDelete={setDeletingId}
        onAddNew={() => setIsCreateModalOpen(true)}
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Transaction"
        description="Create a new income or expense transaction"
      >
        <TransactionForm
          accounts={accounts}
          categories={categories}
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isCreating}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        title="Edit Transaction"
        description="Update transaction details"
      >
        {editingTransaction && (
          <TransactionForm
            accounts={accounts}
            categories={categories}
            initialData={editingTransaction}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTransaction(null)}
            isLoading={isUpdating}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? The account balance will be automatically reversed. This action cannot be undone."
        confirmText="Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  )
}
