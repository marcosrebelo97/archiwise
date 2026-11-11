'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { documentsService } from '@/services/requests/documents'
import type { UpdateUserDocument, UserDocument } from '@/types/project'
import { Queries } from '@/types/queries'
import { addDocumentToList, filterListDocuments } from '@/hooks/edit/useUpdateMetadadoDoc'

export const useMoveDocToTrash = () => {
  const queryClient = useQueryClient()

  const queriesToUpdate = [
    Queries.LIST_ALL_DOCUMENTS,
    Queries.LIST_FAVORITE_DOCS,
    Queries.LIST_DOCUMENTS_BY_CATEGORY,
    Queries.SEARCH_DOCUMENTS
  ]

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserDocument }) => documentsService.update(id, payload),
    onSuccess: userDocument => {
      queriesToUpdate.forEach(query => {
        queryClient.setQueriesData<UserDocument[]>({ queryKey: [query] }, oldData =>
          filterListDocuments(oldData, userDocument)
        )
      })
      queryClient.setQueriesData<UserDocument[]>({ queryKey: [Queries.LIST_DOCS_TRASH] }, oldData =>
        addDocumentToList(oldData, userDocument)
      )
    }
  })

  return {
    updateDocument: mutate,
    isPending,
    isError
  }
}
