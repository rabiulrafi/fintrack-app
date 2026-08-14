import apiClient from './client'
import type { Account, AccountCreate, AccountUpdate } from '@/types'

export const accountsApi = {
  list: (): Promise<Account[]> =>
    apiClient.get('/accounts'),

  get: (id: string): Promise<Account> =>
    apiClient.get(`/accounts/${id}`),

  create: (data: AccountCreate): Promise<Account> =>
    apiClient.post('/accounts', data),

  update: (id: string, data: AccountUpdate): Promise<Account> =>
    apiClient.put(`/accounts/${id}`, data),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/accounts/${id}`),
}
