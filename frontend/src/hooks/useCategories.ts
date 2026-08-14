import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { categoriesApi } from '@/api/categories'
import type { CategoryCreate, CategoryUpdate, CategoryType } from '@/types'

export const useCategories = (typeFilter?: CategoryType) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['categories', typeFilter],
    queryFn: () => categoriesApi.list(typeFilter),
  })

  const createMutation = useMutation({
    mutationFn: (data: CategoryCreate) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category created successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create category')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryUpdate }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('Category updated successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update category')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category deleted successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete category')
    },
  })

  return {
    categories: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    createCategory: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCategory: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCategory: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  }
}
