import { useQuery } from '@tanstack/react-query'

import { Queries } from '@/types/queries'
import { documentsService } from '@/services/requests/documents'

export function useListDocsByTitle(search: string, categoryId: string) {
  return useQuery({
    queryKey: [Queries.LIST_DOCUMENTS_BY_TITLE, { search, categoryId }],
    queryFn: () =>
      documentsService.listAll({
        title: search,
        categoryId: categoryId && categoryId.trim().length > 0 ? categoryId : undefined
      })
  })
}
