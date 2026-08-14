import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import type { Category, BudgetCreate, BudgetWithSpending } from '@/types'

const budgetSchema = z.object({
  category_id: z.string().min(1, 'Please select a category'),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  amount: z.coerce.number().positive('Budget amount must be greater than zero'),
})

type BudgetFormData = z.infer<typeof budgetSchema>

export interface BudgetFormProps {
  categories: Category[]
  initialData?: BudgetWithSpending
  currentMonth: number
  currentYear: number
  onSubmit: (data: BudgetCreate) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  categories,
  initialData,
  currentMonth,
  currentYear,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  // Only expense categories can have budgets
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category_id: initialData?.category_id || '',
      month: initialData?.month || currentMonth,
      year: initialData?.year || currentYear,
      amount: initialData ? parseFloat(initialData.amount) : undefined,
    },
  })

  const onFormSubmit = async (data: BudgetFormData) => {
    await onSubmit({
      ...data,
      amount: Number(data.amount),
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Category selection */}
      <Select
        label="Expense Category *"
        error={errors.category_id?.message}
        disabled={!!initialData}
        {...register('category_id')}
      >
        <option value="">Select Category</option>
        {expenseCategories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.icon ? `${cat.icon} ` : ''}{cat.name}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Month */}
        <Select label="Month *" error={errors.month?.message} {...register('month')}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </Select>

        {/* Year */}
        <Input
          label="Year *"
          type="number"
          error={errors.year?.message}
          {...register('year')}
        />
      </div>

      {/* Amount */}
      <Input
        label="Budget Amount *"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.amount?.message}
        {...register('amount')}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Update Budget' : 'Set Budget'}
        </Button>
      </div>
    </form>
  )
}
