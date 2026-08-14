import React from 'react'
import { DateRangePicker } from '../ui/DateRangePicker'

export interface DashboardFiltersProps {
  period: 'today' | 'this_week' | 'this_month' | 'last_month' | 'this_year' | 'custom'
  startDate?: string
  endDate?: string
  onPeriodChange: (period: 'today' | 'this_week' | 'this_month' | 'last_month' | 'this_year' | 'custom') => void
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  period,
  startDate,
  endDate,
  onPeriodChange,
  onStartDateChange,
  onEndDateChange,
}) => {
  const periods = [
    { key: 'this_month', label: 'This Month' },
    { key: 'last_month', label: 'Last Month' },
    { key: 'this_year', label: 'This Year' },
    { key: 'this_week', label: 'This Week' },
    { key: 'today', label: 'Today' },
    { key: 'custom', label: 'Custom' },
  ] as const

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex flex-wrap items-center gap-1.5">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => onPeriodChange(p.key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              period === p.key
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {period === 'custom' && (
        <div className="pt-2 sm:pt-0">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
          />
        </div>
      )}
    </div>
  )
}
