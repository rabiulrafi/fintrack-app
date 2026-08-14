import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { transactionsApi } from '@/api/transactions'
import type { TransactionCreate, TransactionUpdate, TransactionFilter } from '@/types'

export const useTransactions = (filters?: TransactionFilter) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsApi.list(filters),
  })

  const createMutation = useMutation({
    mutationFn: (data: TransactionCreate) => transactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      toast.success('Transaction created successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create transaction')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransactionUpdate }) =>
      transactionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      toast.success('Transaction updated successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update transaction')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
      toast.success('Transaction deleted')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete transaction')
    },
  })

  return {
    transactionsData: query.data,
    transactions: query.data?.items || [],
    total: query.data?.total || 0,
    page: query.data?.page || 1,
    pageSize: query.data?.page_size || 20,
    totalPages: query.data?.total_pages || 1,
    isLoading: query.isLoading,
    isError: query.isError,
    createTransaction: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTransaction: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTransaction: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  }
}
