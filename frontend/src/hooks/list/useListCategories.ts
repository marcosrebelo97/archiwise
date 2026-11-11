import { useQuery } from '@tanstack/react-query'

import { Queries } from '@/types/queries'
import { categoryService } from '@/services/requests/category'

export function useListCategories() {
  return useQuery({
    queryKey: [Queries.LIST_CATEGORIES],
    queryFn: categoryService.listAll
  })
}
