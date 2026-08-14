// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  full_name: string
  email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  full_name: string
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

// ─── Account ─────────────────────────────────────────────────────────────────
export type AccountType = 'CASH' | 'BANK' | 'CREDIT_CARD' | 'MOBILE_WALLET' | 'SAVINGS' | 'OTHER'

export interface Account {
  id: string
  user_id: string
  name: string
  account_type: AccountType
  currency: string
  opening_balance: string
  current_balance: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AccountCreate {
  name: string
  account_type: AccountType
  currency: string
  opening_balance: number
}

export interface AccountUpdate {
  name?: string
  account_type?: AccountType
  is_active?: boolean
}

// ─── Category ────────────────────────────────────────────────────────────────
export type CategoryType = 'INCOME' | 'EXPENSE'

export interface Category {
  id: string
  user_id: string
  name: string
  type: CategoryType
  icon: string | null
  color: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface CategoryCreate {
  name: string
  type: CategoryType
  icon?: string
  color?: string
}

export interface CategoryUpdate {
  name?: string
  icon?: string
  color?: string
}

// ─── Transaction ─────────────────────────────────────────────────────────────
export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Transaction {
  id: string
  user_id: string
  account_id: string
  category_id: string
  transaction_type: TransactionType
  amount: string
  currency: string
  transaction_date: string
  description: string | null
  notes: string | null
  reference_number: string | null
  created_at: string
  updated_at: string
  account?: Account
  category?: Category
}

export interface TransactionCreate {
  account_id: string
  category_id: string
  transaction_type: TransactionType
  amount: number
  currency: string
  transaction_date: string
  description?: string
  notes?: string
  reference_number?: string
}

export type TransactionUpdate = Partial<TransactionCreate>

export interface TransactionFilter {
  date_from?: string
  date_to?: string
  transaction_type?: TransactionType
  category_id?: string
  account_id?: string
  search?: string
  amount_min?: number
  amount_max?: number
  page?: number
  page_size?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// ─── Transfer ─────────────────────────────────────────────────────────────────
export interface Transfer {
  id: string
  user_id: string
  from_account_id: string
  to_account_id: string
  amount: string
  currency: string
  transfer_date: string
  description: string | null
  created_at: string
  updated_at: string
  from_account?: Account
  to_account?: Account
}

export interface TransferCreate {
  from_account_id: string
  to_account_id: string
  amount: number
  currency: string
  transfer_date: string
  description?: string
}

// ─── Budget ──────────────────────────────────────────────────────────────────
export interface Budget {
  id: string
  user_id: string
  category_id: string
  month: number
  year: number
  amount: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface BudgetWithSpending extends Budget {
  spent: string
  remaining: string
  percentage: number
}

export interface BudgetCreate {
  category_id: string
  month: number
  year: number
  amount: number
}

export interface BudgetUpdate {
  amount: number
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardSummary {
  total_balance: string
  total_income: string
  total_expense: string
  net_savings: string
  current_month_income: string
  current_month_expense: string
}

export interface MonthlyChartData {
  month: string
  income: number
  expense: number
}

export interface CategoryExpense {
  category_id: string
  category_name: string
  category_color: string | null
  total: number
  percentage: number
}

export interface AccountBalance {
  account_id: string
  account_name: string
  account_type: string
  balance: number
}

export interface DashboardData {
  summary: DashboardSummary
  monthly_chart: MonthlyChartData[]
  category_expenses: CategoryExpense[]
  account_balances: AccountBalance[]
  recent_transactions: Transaction[]
}

// ─── API Error ────────────────────────────────────────────────────────────────
export interface ApiError {
  success: false
  message: string
  error_code: string
}
