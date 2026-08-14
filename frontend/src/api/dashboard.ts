import apiClient from './client'
import type { DashboardData } from '@/types'

export const dashboardApi = {
  getDashboard: (dateFrom?: string, dateTo?: string): Promise<DashboardData> =>
    apiClient.get('/dashboard', { params: { date_from: dateFrom, date_to: dateTo } }),
}
