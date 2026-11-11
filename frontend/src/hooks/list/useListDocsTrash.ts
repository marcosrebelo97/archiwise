'use client'
import { useQuery } from '@tanstack/react-query'

import { documentsService } from '@/services/requests/documents'

import { Queries } from '@/types/queries'

export function useListDocsTrash() {
  const { data, isPending, isError, refetch, isFetching, isLoading } = useQuery({
    queryKey: [Queries.LIST_DOCS_TRASH],
    queryFn: () => documentsService.listAll({ isDeleted: true })
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
