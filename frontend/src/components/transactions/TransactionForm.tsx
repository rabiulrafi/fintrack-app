import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import type { Account, Category, TransactionCreate, Transaction } from '@/types'

const transactionSchema = z.object({
  transaction_type: z.enum(['INCOME', 'EXPENSE']),
  account_id: z.string().min(1, 'Please select an account'),
  category_id: z.string().min(1, 'Please select a category'),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  currency: z.string().default('BDT'),
  transaction_date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  notes: z.string().optional(),
  reference_number: z.string().optional(),
})

type TransactionFormData = z.infer<typeof transactionSchema>

export interface TransactionFormProps {
  accounts: Account[]
  categories: Category[]
  initialData?: Transaction
  onSubmit: (data: TransactionCreate) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  accounts,
  categories,
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      transaction_type: initialData?.transaction_type || 'EXPENSE',
      account_id: initialData?.account_id || (accounts[0]?.id ?? ''),
      category_id: initialData?.category_id || '',
      amount: initialData ? parseFloat(initialData.amount) : undefined,
      currency: initialData?.currency || 'BDT',
      transaction_date: initialData?.transaction_date || new Date().toISOString().slice(0, 10),
      description: initialData?.description || '',
      notes: initialData?.notes || '',
      reference_number: initialData?.reference_number || '',
    },
  })

  const selectedType = watch('transaction_type')

  // Filter categories by the currently selected transaction type
  const filteredCategories = categories.filter((c) => c.type === selectedType)

  const handleTypeChange = (type: 'INCOME' | 'EXPENSE') => {
    setValue('transaction_type', type)
    setValue('category_id', '') // Reset category when switching type
  }

  const onFormSubmit = async (data: TransactionFormData) => {
    await onSubmit({
      ...data,
      amount: Number(data.amount),
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Type toggle buttons */}
      <div>
        <label className="form-label">Transaction Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('EXPENSE')}
            className={`py-2 px-4 text-sm font-semibold rounded-lg border transition-all ${
              selectedType === 'EXPENSE'
                ? 'bg-red-50 text-red-700 border-red-200 ring-2 ring-red-500/20'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('INCOME')}
            className={`py-2 px-4 text-sm font-semibold rounded-lg border transition-all ${
              selectedType === 'INCOME'
                ? 'bg-green-50 text-green-700 border-green-200 ring-2 ring-green-500/20'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Account selection */}
        <Select
          label="Account *"
          error={errors.account_id?.message}
          {...register('account_id')}
        >
          <option value="">Select Account</option>
          {accounts.map((acct) => (
            <option key={acct.id} value={acct.id}>
              {acct.name} ({acct.currency})
            </option>
          ))}
        </Select>

        {/* Category selection */}
        <Select
          label="Category *"
          error={errors.category_id?.message}
          {...register('category_id')}
        >
          <option value="">Select Category</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon ? `${cat.icon} ` : ''}{cat.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount */}
        <Input
          label="Amount *"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount')}
        />

        {/* Date */}
        <Input
          label="Date *"
          type="date"
          error={errors.transaction_date?.message}
          {...register('transaction_date')}
        />
      </div>

      {/* Description */}
      <Input
        label="Description"
        placeholder="e.g. Grocery shopping, Client payment"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Reference Number */}
        <Input
          label="Reference Number"
          placeholder="e.g. INV-10492"
          error={errors.reference_number?.message}
          {...register('reference_number')}
        />

        {/* Notes */}
        <Input
          label="Notes"
          placeholder="Additional notes"
          error={errors.notes?.message}
          {...register('notes')}
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Update Transaction' : 'Save Transaction'}
        </Button>
      </div>
    </form>
  )
}
