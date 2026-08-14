import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { ACCOUNT_TYPE_LABELS, CURRENCIES } from '@/utils/constants'
import type { Account, AccountCreate, AccountType } from '@/types'

const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  account_type: z.enum(['CASH', 'BANK', 'CREDIT_CARD', 'MOBILE_WALLET', 'SAVINGS', 'OTHER']),
  currency: z.string().min(1, 'Currency is required'),
  opening_balance: z.coerce.number().min(0, 'Opening balance cannot be negative'),
})

type AccountFormData = z.infer<typeof accountSchema>

export interface AccountFormProps {
  initialData?: Account
  onSubmit: (data: AccountCreate) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const AccountForm: React.FC<AccountFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: initialData?.name || '',
      account_type: initialData?.account_type || 'BANK',
      currency: initialData?.currency || 'BDT',
      opening_balance: initialData ? parseFloat(initialData.opening_balance) : 0,
    },
  })

  const onFormSubmit = async (data: AccountFormData) => {
    await onSubmit({
      ...data,
      opening_balance: Number(data.opening_balance),
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Account Name */}
      <Input
        label="Account Name *"
        placeholder="e.g. Chase Checking, Main Wallet"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Account Type */}
        <Select
          label="Account Type *"
          error={errors.account_type?.message}
          {...register('account_type')}
        >
          {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        {/* Currency */}
        <Select
          label="Currency *"
          error={errors.currency?.message}
          {...register('currency')}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} ({c.symbol}) - {c.name}
            </option>
          ))}
        </Select>
      </div>

      {/* Opening Balance (only editable during creation) */}
      <Input
        label="Opening Balance *"
        type="number"
        step="0.01"
        placeholder="0.00"
        disabled={!!initialData}
        error={errors.opening_balance?.message}
        helperText={initialData ? 'Opening balance cannot be modified once created' : undefined}
        {...register('opening_balance')}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Update Account' : 'Create Account'}
        </Button>
      </div>
    </form>
  )
}
