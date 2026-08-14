import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TransactionForm } from '../components/transactions/TransactionForm'
import type { Account, Category } from '@/types'

const mockAccounts: Account[] = [
  {
    id: 'acc-1',
    user_id: 'user-1',
    name: 'Main Checking',
    account_type: 'BANK',
    currency: 'USD',
    opening_balance: '1000.00',
    current_balance: '1500.00',
    is_active: true,
    created_at: '',
    updated_at: '',
  },
]

const mockCategories: Category[] = [
  {
    id: 'cat-1',
    user_id: 'user-1',
    name: 'Groceries',
    type: 'EXPENSE',
    icon: '🍔',
    color: '#ef4444',
    is_default: true,
    created_at: '',
    updated_at: '',
  },
]

describe('TransactionForm Component', () => {
  it('renders all required form controls', () => {
    const handleSubmit = vi.fn()
    const handleCancel = vi.fn()

    render(
      <TransactionForm
        accounts={mockAccounts}
        categories={mockCategories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    )

    expect(screen.getByRole('button', { name: /expense/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /income/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/account \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/amount \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date \*/i)).toBeInTheDocument()
  })
})
