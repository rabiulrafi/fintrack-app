import React from 'react'
import { Calendar } from 'lucide-react'

export interface DateRangePickerProps {
  startDate?: string
  endDate?: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  className?: string
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
          <Calendar className="w-4 h-4" />
        </div>
        <input
          type="date"
          value={startDate || ''}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="form-input pl-8 py-1.5 text-xs rounded-lg"
          placeholder="From"
        />
      </div>
      <span className="text-gray-400 text-xs font-medium">to</span>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
          <Calendar className="w-4 h-4" />
        </div>
        <input
          type="date"
          value={endDate || ''}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="form-input pl-8 py-1.5 text-xs rounded-lg"
          placeholder="To"
        />
      </div>
    </div>
  )
}
