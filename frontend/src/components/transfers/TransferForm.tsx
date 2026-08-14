import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import type { Account, TransferCreate } from '@/types'

const transferSchema = z
  .object({
    from_account_id: z.string().min(1, 'Source account is required'),
    to_account_id: z.string().min(1, 'Destination account is required'),
    amount: z.coerce.number().positive('Amount must be greater than zero'),
    currency: z.string().default('BDT'),
    transfer_date: z.string().min(1, 'Date is required'),
    description: z.string().optional(),
  })
  .refine((data) => data.from_account_id !== data.to_account_id, {
    message: 'Source and destination accounts must be different',
    path: ['to_account_id'],
  })

type TransferFormData = z.infer<typeof transferSchema>

export interface TransferFormProps {
  accounts: Account[]
  onSubmit: (data: TransferCreate) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const TransferForm: React.FC<TransferFormProps> = ({
  accounts,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      from_account_id: accounts[0]?.id || '',
      to_account_id: accounts[1]?.id || '',
      currency: 'BDT',
      transfer_date: new Date().toISOString().slice(0, 10),
      description: '',
    },
  })

  const fromAccountId = watch('from_account_id')

  const onFormSubmit = async (data: TransferFormData) => {
    await onSubmit({
      ...data,
      amount: Number(data.amount),
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Source Account */}
        <Select
          label="From Account *"
          error={errors.from_account_id?.message}
          {...register('from_account_id')}
        >
          <option value="">Select source account</option>
          {accounts.map((acct) => (
            <option key={acct.id} value={acct.id}>
              {acct.name} (৳{acct.current_balance})
            </option>
          ))}
        </Select>

        {/* Destination Account */}
        <Select
          label="To Account *"
          error={errors.to_account_id?.message}
          {...register('to_account_id')}
        >
          <option value="">Select destination account</option>
          {accounts
            .filter((acct) => acct.id !== fromAccountId)
            .map((acct) => (
              <option key={acct.id} value={acct.id}>
                {acct.name} (৳{acct.current_balance})
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
          error={errors.transfer_date?.message}
          {...register('transfer_date')}
        />
      </div>

      {/* Description */}
      <Input
        label="Description / Notes"
        placeholder="e.g. ATM withdrawal, moving to savings"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Execute Transfer
        </Button>
      </div>
    </form>
  )
}
