import { useMutation, useQueryClient } from '@tanstack/react-query'

import { categoryService } from '@/services/requests/category'
import { Queries } from '@/types/queries'
import type { EditCategoryData } from '@/validation/editCategoryShema'
import type { Category } from '@/types/project'

export interface EditCategoryPayload extends EditCategoryData {
  categoryId: string
}

export function useEditCategory() {
  const queryClient = useQueryClient()

  const { mutate: onEditCategory, isPending } = useMutation({
    mutationFn: (data: EditCategoryPayload) => {
      const { categoryId, ...payload } = data

      return categoryService.update(categoryId, payload)
    },
    onSuccess(category) {
      queryClient.setQueriesData<Category>(
        {
          queryKey: [Queries.DETAILS_CATEGORY, category.id]
        },
        category
      )
      queryClient.setQueriesData<Category[]>(
        {
          queryKey: [Queries.LIST_CATEGORIES]
        },
        oldData => {
          return oldData?.map(item => (item.id === category.id ? category : item))
        }
      )
    }
  })

  return { onEditCategory, isPending }
}
