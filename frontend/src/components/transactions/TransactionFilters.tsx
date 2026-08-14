import React, { useState, useEffect } from 'react'
import { Search, X, RotateCcw } from 'lucide-react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import type { Account, Category, TransactionFilter } from '@/types'

export interface TransactionFiltersProps {
  filters: TransactionFilter
  accounts: Account[]
  categories: Category[]
  onFilterChange: (filters: TransactionFilter) => void
  onReset: () => void
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  accounts,
  categories,
  onFilterChange,
  onReset,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        onFilterChange({ ...filters, search: searchTerm || undefined, page: 1 })
      }
    }, 300)

    return () => clearTimeout(handler)
  }, [searchTerm, filters, onFilterChange])

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3.5">
      {/* Top Search bar */}
      <div className="relative">
        <Input
          placeholder="Search by description, reference, or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          rightIcon={
            searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null
          }
        />
      </div>

      {/* Filter inputs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Type Filter */}
        <Select
          value={filters.transaction_type || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              transaction_type: (e.target.value as 'INCOME' | 'EXPENSE') || undefined,
              page: 1,
            })
          }
        >
          <option value="">All Types</option>
          <option value="INCOME">Income Only</option>
          <option value="EXPENSE">Expense Only</option>
        </Select>

        {/* Account Filter */}
        <Select
          value={filters.account_id || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              account_id: e.target.value || undefined,
              page: 1,
            })
          }
        >
          <option value="">All Accounts</option>
          {accounts.map((acct) => (
            <option key={acct.id} value={acct.id}>
              {acct.name}
            </option>
          ))}
        </Select>

        {/* Category Filter */}
        <Select
          value={filters.category_id || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              category_id: e.target.value || undefined,
              page: 1,
            })
          }
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon ? `${cat.icon} ` : ''}{cat.name}
            </option>
          ))}
        </Select>

        {/* Date From */}
        <input
          type="date"
          value={filters.date_from || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              date_from: e.target.value || undefined,
              page: 1,
            })
          }
          className="form-input text-xs"
          title="Date From"
        />
      </div>

      {/* Secondary Row: Date To and Reset */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">To:</span>
          <input
            type="date"
            value={filters.date_to || ''}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                date_to: e.target.value || undefined,
                page: 1,
              })
            }
            className="form-input text-xs w-auto"
            title="Date To"
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearchTerm('')
            onReset()
          }}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
