import { useQuery } from '@tanstack/react-query'

import { Queries } from '@/types/queries'
import { documentsService } from '@/services/requests/documents'
import { useGetParamsSearch } from '@/hooks/useGetParamsSearch'

export function useListDocumentsByCategory(categoryId: string) {
  const params = useGetParamsSearch()

  return useQuery({
    queryKey: [Queries.LIST_DOCUMENTS_BY_CATEGORY, categoryId],
    queryFn: () => documentsService.listAll({ categoryId, ...params })
  })
}
