import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'
import { formatCurrency } from '@/utils/formatters'
import type { CategoryExpense } from '@/types'

export interface CategoryPieChartProps {
  data: CategoryExpense[]
  isLoading?: boolean
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card title="Expenses by Category" subtitle="Spending breakdown">
        <div className="h-72 flex items-center justify-center">
          <div className="animate-pulse w-48 h-48 rounded-full bg-gray-100" />
        </div>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card title="Expenses by Category" subtitle="Spending breakdown">
        <div className="h-72 flex items-center justify-center">
          <EmptyState
            title="No expense data"
            description="Add expense transactions to see your category breakdown."
          />
        </div>
      </Card>
    )
  }

  return (
    <Card title="Expenses by Category" subtitle="Top spending categories">
      <div className="h-72 w-full flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="total"
                nameKey="category_name"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.category_color || '#16a34a'}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Spent']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '0.5rem',
                  border: '1px solid #f3f4f6',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="w-full md:w-1/2 flex flex-col gap-2 max-h-56 overflow-y-auto px-2">
          {data.slice(0, 6).map((item) => (
            <div key={item.category_id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.category_color || '#16a34a' }}
                />
                <span className="font-medium text-gray-700 truncate">{item.category_name}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-semibold text-gray-900">{formatCurrency(item.total)}</span>
                <span className="text-gray-400">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
