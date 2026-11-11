import { useQuery } from '@tanstack/react-query'

import { Queries } from '@/types/queries'
import { categoryService } from '@/services/requests/category'

export function useDetailsCategory(categoryId: string) {
  return useQuery({
    queryKey: [Queries.DETAILS_CATEGORY, categoryId],
    queryFn: () => categoryService.findOne(categoryId)
  })
}
