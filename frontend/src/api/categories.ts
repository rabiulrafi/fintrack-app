import apiClient from './client'
import type { Category, CategoryCreate, CategoryUpdate, CategoryType } from '@/types'

export const categoriesApi = {
  list: (type?: CategoryType): Promise<Category[]> =>
    apiClient.get('/categories', { params: type ? { type } : {} }),

  get: (id: string): Promise<Category> =>
    apiClient.get(`/categories/${id}`),

  create: (data: CategoryCreate): Promise<Category> =>
    apiClient.post('/categories', data),

  update: (id: string, data: CategoryUpdate): Promise<Category> =>
    apiClient.put(`/categories/${id}`, data),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/categories/${id}`),
}
