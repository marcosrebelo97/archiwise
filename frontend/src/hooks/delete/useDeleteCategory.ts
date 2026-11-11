import { useMutation, useQueryClient } from '@tanstack/react-query'

import { categoryService } from '@/services/requests/category'
import { Queries } from '@/types/queries'
import type { Category } from '@/types/project'

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  const {
    mutate: onDeleteCategory,
    isPending,
    error
  } = useMutation({
    mutationFn: (categoryId: string) => categoryService.remove(categoryId),
    onSuccess(_, categoryId) {
      queryClient.setQueriesData<Category[]>(
        {
          queryKey: [Queries.LIST_CATEGORIES]
        },
        oldData => oldData?.filter(category => category.id !== categoryId)
      )
    }
  })

  return { onDeleteCategory, isPending, error }
}
