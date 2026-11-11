'use client'
import { useQuery } from '@tanstack/react-query'

import { documentsService } from '@/services/requests/documents'

import { Queries } from '@/types/queries'
import { useGetParamsSearch } from '@/hooks/useGetParamsSearch'

export function useListFavoriteDocs() {
  const params = useGetParamsSearch()

  const { data, isPending, isError, refetch, isFetching, isLoading } = useQuery({
    queryKey: [Queries.LIST_FAVORITE_DOCS, params],
    queryFn: () => documentsService.listAll({ isFavorite: true, ...params })
  })

  return {
    documents: data || [],
    isPending,
    isError,
    refetch,
    isFetching,
    isLoading
  }
}
