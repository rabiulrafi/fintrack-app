import apiClient from './client'
import type { Transfer, TransferCreate } from '@/types'

export const transfersApi = {
  list: (): Promise<Transfer[]> =>
    apiClient.get('/transfers'),

  get: (id: string): Promise<Transfer> =>
    apiClient.get(`/transfers/${id}`),

  create: (data: TransferCreate): Promise<Transfer> =>
    apiClient.post('/transfers', data),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/transfers/${id}`),
}
