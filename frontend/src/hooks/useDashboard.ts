import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'

export const useDashboard = (dateFrom?: string, dateTo?: string) => {
  const query = useQuery({
    queryKey: ['dashboard', dateFrom, dateTo],
    queryFn: () => dashboardApi.getDashboard(dateFrom, dateTo),
  })

  return {
    dashboardData: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
