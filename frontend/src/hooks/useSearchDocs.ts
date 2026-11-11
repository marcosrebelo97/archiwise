'use client'

import { useQuery } from '@tanstack/react-query'

import { Queries } from '@/types/queries'
import { documentsService } from '@/services/requests/documents'
import { useGetParamsSearch } from '@/hooks/useGetParamsSearch'

export function useSearchDocs() {
  const params = useGetParamsSearch()

  return useQuery({
    queryKey: [Queries.SEARCH_DOCUMENTS, params],
    queryFn: () => documentsService.search(params)
  })
}
