import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryCards } from '../components/dashboard/SummaryCards'

describe('SummaryCards Component', () => {
  it('renders all key financial indicators properly', () => {
    const mockSummary = {
      total_balance: '5400.00',
      total_income: '8000.00',
      total_expense: '2600.00',
      net_savings: '5400.00',
      current_month_income: '4000.00',
      current_month_expense: '1200.00',
    }

    render(<SummaryCards summary={mockSummary} />)

    expect(screen.getByText(/total balance/i)).toBeInTheDocument()
    expect(screen.getByText(/৳5,400\.00/i)).toBeInTheDocument()
    expect(screen.getByText(/total income/i)).toBeInTheDocument()
    expect(screen.getByText(/৳8,000\.00/i)).toBeInTheDocument()
    expect(screen.getByText(/total expense/i)).toBeInTheDocument()
    expect(screen.getByText(/৳2,600\.00/i)).toBeInTheDocument()
  })
})
