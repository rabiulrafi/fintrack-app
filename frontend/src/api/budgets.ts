import apiClient from './client'
import type { BudgetWithSpending, BudgetCreate, BudgetUpdate } from '@/types'

export const budgetsApi = {
  list: (month?: number, year?: number): Promise<BudgetWithSpending[]> =>
    apiClient.get('/budgets', { params: { month, year } }),

  get: (id: string): Promise<BudgetWithSpending> =>
    apiClient.get(`/budgets/${id}`),

  create: (data: BudgetCreate): Promise<BudgetWithSpending> =>
    apiClient.post('/budgets', data),

  update: (id: string, data: BudgetUpdate): Promise<BudgetWithSpending> =>
    apiClient.put(`/budgets/${id}`, data),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/budgets/${id}`),
}
