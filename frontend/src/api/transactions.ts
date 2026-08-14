import apiClient from './client'
import type { Transaction, TransactionCreate, TransactionUpdate, TransactionFilter, PaginatedResponse } from '@/types'

export const transactionsApi = {
  list: (filters?: TransactionFilter): Promise<PaginatedResponse<Transaction>> =>
    apiClient.get('/transactions', { params: filters }),

  get: (id: string): Promise<Transaction> =>
    apiClient.get(`/transactions/${id}`),

  create: (data: TransactionCreate): Promise<Transaction> =>
    apiClient.post('/transactions', data),

  update: (id: string, data: TransactionUpdate): Promise<Transaction> =>
    apiClient.put(`/transactions/${id}`, data),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/transactions/${id}`),
}
