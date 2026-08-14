import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card } from '../ui/Card'
import { formatCurrency } from '@/utils/formatters'
import type { MonthlyChartData } from '@/types'

export interface IncomeExpenseChartProps {
  data: MonthlyChartData[]
  isLoading?: boolean
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card title="Income vs Expense" subtitle="Monthly overview">
        <div className="h-72 flex items-center justify-center">
          <div className="animate-pulse w-full h-full bg-gray-100 rounded-lg" />
        </div>
      </Card>
    )
  }

  return (
    <Card title="Income vs Expense" subtitle="Annual breakdown by month">
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(val) => `৳${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), '']}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                border: '1px solid #f3f4f6',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="#16a34a"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="#dc2626"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
