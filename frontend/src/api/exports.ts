import apiClient from './client'
import type { TransactionFilter } from '@/types'

export const exportsApi = {
  exportCSV: async (filters?: TransactionFilter) => {
    const response = await apiClient.get('/exports/transactions/csv', {
      params: filters,
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response as unknown as BlobPart]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  exportExcel: async (filters?: TransactionFilter) => {
    const response = await apiClient.get('/exports/transactions/excel', {
      params: filters,
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response as unknown as BlobPart]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  exportPDF: async (filters?: TransactionFilter) => {
    const response = await apiClient.get('/exports/transactions/pdf', {
      params: filters,
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response as unknown as BlobPart]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },
}
