import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/utils/constants'
import type { Category, CategoryCreate, CategoryType } from '@/types'

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  type: z.enum(['INCOME', 'EXPENSE']),
  icon: z.string().optional(),
  color: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

export interface CategoryFormProps {
  initialData?: Category
  defaultType?: CategoryType
  onSubmit: (data: CategoryCreate) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  defaultType = 'EXPENSE',
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
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || defaultType,
      icon: initialData?.icon || '📁',
      color: initialData?.color || CATEGORY_COLORS[0],
    },
  })

  const selectedType = watch('type')
  const selectedIcon = watch('icon')
  const selectedColor = watch('color')

  const onFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Type selection */}
      <div>
        <label className="form-label">Category Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!!initialData}
            onClick={() => setValue('type', 'EXPENSE')}
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
            disabled={!!initialData}
            onClick={() => setValue('type', 'INCOME')}
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

      {/* Category Name */}
      <Input
        label="Category Name *"
        placeholder="e.g. Groceries, Freelance Work"
        error={errors.name?.message}
        {...register('name')}
      />

      {/* Icon Picker */}
      <div>
        <label className="form-label">Icon</label>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2 border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
          {Object.keys(CATEGORY_ICONS).map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setValue('icon', icon)}
              className={`p-2 text-xl rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center ${
                selectedIcon === icon ? 'bg-primary-100 ring-2 ring-primary-500' : ''
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div>
        <label className="form-label">Color Accent</label>
        <div className="flex flex-wrap gap-2.5 p-2 border border-gray-200 rounded-lg">
          {CATEGORY_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={`w-7 h-7 rounded-full transition-transform ${
                selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-900' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  )
}
