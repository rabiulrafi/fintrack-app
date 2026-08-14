import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { transfersApi } from '@/api/transfers'
import type { TransferCreate } from '@/types'

export const useTransfers = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['transfers'],
    queryFn: () => transfersApi.list(),
  })

  const createMutation = useMutation({
    mutationFn: (data: TransferCreate) => transfersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transfer completed successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to complete transfer')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transfersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transfer deleted')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete transfer')
    },
  })

  return {
    transfers: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    createTransfer: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteTransfer: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  }
}
