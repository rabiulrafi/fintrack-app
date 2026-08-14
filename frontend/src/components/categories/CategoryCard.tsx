import React from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { Card } from '../ui/Card'
import type { Category } from '@/types'

export interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{
              backgroundColor: category.color ? `${category.color}20` : '#f3f4f6',
              color: category.color || '#374151',
            }}
          >
            {category.icon || '📁'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{category.name}</h4>
            <span
              className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                category.type === 'INCOME'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {category.type}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(category)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit Category"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  )
}
