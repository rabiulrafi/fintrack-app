import React, { useState } from 'react'
import { Plus, ArrowLeftRight } from 'lucide-react'
import { AccountCard } from '@/components/accounts/AccountCard'
import { AccountForm } from '@/components/accounts/AccountForm'
import { TransferForm } from '@/components/transfers/TransferForm'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAccounts } from '@/hooks/useAccounts'
import { useTransfers } from '@/hooks/useTransfers'
import type { Account, AccountCreate, TransferCreate } from '@/types'

export const Accounts: React.FC = () => {
  const {
    accounts,
    isLoading,
    createAccount,
    isCreating,
    updateAccount,
    isUpdating,
    deleteAccount,
    isDeleting,
  } = useAccounts()

  const { createTransfer, isCreating: isTransferring } = useTransfers()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleCreate = async (data: AccountCreate) => {
    await createAccount(data)
    setIsCreateOpen(false)
  }

  const handleUpdate = async (data: AccountCreate) => {
    if (!editingAccount) return
    await updateAccount({ id: editingAccount.id, data })
    setEditingAccount(null)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    await deleteAccount(deletingId)
    setDeletingId(null)
  }

  const handleTransfer = async (data: TransferCreate) => {
    await createTransfer(data)
    setIsTransferOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Financial Accounts</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your cash, bank accounts, cards, and wallets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsTransferOpen(true)}
            leftIcon={<ArrowLeftRight className="w-4 h-4" />}
            disabled={accounts.length < 2}
          >
            Transfer Funds
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Account
          </Button>
        </div>
      </div>

      {/* Grid of Accounts */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No accounts created"
            description="Create your first financial account to begin recording transactions and balances."
            action={
              <Button onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Add Account
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((acct) => (
            <AccountCard
              key={acct.id}
              account={acct}
              onEdit={setEditingAccount}
              onDelete={setDeletingId}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add Account"
        description="Set up a new cash wallet or bank account"
      >
        <AccountForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          isLoading={isCreating}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        title="Edit Account"
        description="Update account details"
      >
        {editingAccount && (
          <AccountForm
            initialData={editingAccount}
            onSubmit={handleUpdate}
            onCancel={() => setEditingAccount(null)}
            isLoading={isUpdating}
          />
        )}
      </Modal>

      {/* Transfer Modal */}
      <Modal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        title="Transfer Funds"
        description="Move money between two accounts"
      >
        <TransferForm
          accounts={accounts}
          onSubmit={handleTransfer}
          onCancel={() => setIsTransferOpen(false)}
          isLoading={isTransferring}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Account"
        message="Are you sure you want to delete this account? Accounts with existing transactions cannot be deleted. This action cannot be undone."
        confirmText="Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  )
}
