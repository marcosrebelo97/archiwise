import { useMutation, useQueryClient } from '@tanstack/react-query'

import { categoryService } from '@/services/requests/category'
import { Queries } from '@/types/queries'
import type { CreateCategoryData } from '@/validation/createCategoryShema'
import type { Category } from '@/types/project'

export function useCreateCategory() {
  const queryClient = useQueryClient()

  const { mutate: onCreateCategory, isPending } = useMutation({
    mutationFn: (data: CreateCategoryData) => categoryService.create(data),
    onSuccess(newCategory) {
      queryClient.setQueriesData<Category[]>({ queryKey: [Queries.LIST_CATEGORIES] }, oldData => {
        if (oldData) {
          return [newCategory, ...oldData]
        }

        return [newCategory]
      })
    }
  })

  return { onCreateCategory, isPending }
}
