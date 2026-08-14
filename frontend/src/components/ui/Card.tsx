import React from 'react'
import { classNames } from '@/utils/formatters'

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  noPadding?: boolean
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  noPadding = false,
  children,
  className,
  ...props
}) => {
  return (
    <div className={classNames('card', className)} {...props}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  )
}
