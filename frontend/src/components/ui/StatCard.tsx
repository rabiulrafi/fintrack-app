import React from 'react'
import { Card } from './Card'
import { classNames } from '@/utils/formatters'

export interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon?: React.ReactNode
  variant?: 'default' | 'income' | 'expense' | 'savings'
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  className,
}) => {
  const iconVariantClasses = {
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    income: 'bg-green-50 text-green-600 dark:bg-green-950/60 dark:text-green-400',
    expense: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400',
    savings: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
  }

  const valueVariantClasses = {
    default: 'text-gray-900 dark:text-gray-100',
    income: 'text-green-600 dark:text-green-400',
    expense: 'text-red-600 dark:text-red-400',
    savings: 'text-blue-600 dark:text-blue-400',
  }

  return (
    <Card className={classNames('hover:shadow-md transition-shadow overflow-hidden', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 truncate">
            {title}
          </p>
          <h3
            className={classNames(
              'text-xl sm:text-2xl font-black mt-1.5 tracking-tight break-all truncate',
              valueVariantClasses[variant]
            )}
            title={value}
          >
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={classNames(
              'p-3 rounded-xl flex-shrink-0 flex items-center justify-center shadow-xs',
              iconVariantClasses[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
