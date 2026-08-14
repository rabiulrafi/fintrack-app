import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { budgetsApi } from '@/api/budgets'
import type { BudgetCreate, BudgetUpdate } from '@/types'

export const useBudgets = (month?: number, year?: number) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['budgets', month, year],
    queryFn: () => budgetsApi.list(month, year),
  })

  const createMutation = useMutation({
    mutationFn: (data: BudgetCreate) => budgetsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Budget set successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to set budget')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BudgetUpdate }) =>
      budgetsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Budget updated successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update budget')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => budgetsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Budget deleted successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete budget')
    },
  })

  return {
    budgets: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    createBudget: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateBudget: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteBudget: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  }
}
