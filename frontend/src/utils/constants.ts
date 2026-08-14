import { AccountType } from '@/types'

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  CASH: 'Cash',
  BANK: 'Bank Account',
  CREDIT_CARD: 'Credit Card',
  MOBILE_WALLET: 'Mobile Wallet',
  SAVINGS: 'Savings Account',
  OTHER: 'Other',
}

export const CATEGORY_ICONS: Record<string, string> = {
  '💼': 'Salary/Work',
  '💻': 'Freelance',
  '🏢': 'Business',
  '🎁': 'Bonus/Gift',
  '🏦': 'Interest',
  '📈': 'Investment',
  '💰': 'General Income',
  '🍔': 'Food & Dining',
  '🚗': 'Transportation',
  '🏠': 'Rent/Housing',
  '💡': 'Utilities',
  '🛍️': 'Shopping',
  '🏥': 'Healthcare',
  '📚': 'Education',
  '🎬': 'Entertainment',
  '✈️': 'Travel',
  '📄': 'Bills',
  '🛡️': 'Insurance',
  '📦': 'Other',
}

export const CATEGORY_COLORS: string[] = [
  '#16a34a', // Emerald green
  '#059669', // Teal green
  '#0891b2', // Cyan
  '#2563eb', // Blue
  '#4f46e5', // Indigo
  '#7c3aed', // Violet
  '#9333ea', // Purple
  '#c026d3', // Fuchsia
  '#db2777', // Pink
  '#e11d48', // Rose
  '#dc2626', // Red
  '#ea580c', // Orange
  '#d97706', // Amber
  '#ca8a04', // Yellow
  '#4b5563', // Slate
]

export const CURRENCIES = [
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
]
