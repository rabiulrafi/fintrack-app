import React from 'react'
import { classNames } from '@/utils/formatters'

export interface BadgeProps {
  variant?: 'income' | 'expense' | 'warning' | 'neutral' | 'primary'
  children: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className,
}) => {
  const variantClasses = {
    income: 'bg-green-100 text-green-800 border border-green-200',
    expense: 'bg-red-100 text-red-800 border border-red-200',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
    primary: 'bg-primary-100 text-primary-800 border border-primary-200',
  }

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
