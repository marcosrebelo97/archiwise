'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { documentsService } from '@/services/requests/documents'
import type { UpdateUserDocument, UserDocument } from '@/types/project'
import { Queries } from '@/types/queries'
import { addDocumentToList, filterListDocuments, updateListDocuments } from '@/hooks/edit/useUpdateMetadadoDoc'

export const useUpdateFavoriteDoc = () => {
  const queryClient = useQueryClient()
  const queriesToUpdate = [Queries.LIST_ALL_DOCUMENTS, Queries.LIST_DOCUMENTS_BY_CATEGORY]

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserDocument }) => documentsService.update(id, payload),
    onSuccess: (userDocument, oldData) => {
      queriesToUpdate.forEach(queryKey => {
        queryClient.setQueriesData<UserDocument[]>({ queryKey: [queryKey] }, oldData =>
          updateListDocuments(oldData, userDocument)
        )
      })

      if (oldData.payload.isFavorite) {
        queryClient.setQueriesData<UserDocument[]>({ queryKey: [Queries.LIST_FAVORITE_DOCS] }, oldData =>
          addDocumentToList(oldData, userDocument)
        )
      } else {
        queryClient.setQueriesData<UserDocument[]>({ queryKey: [Queries.LIST_FAVORITE_DOCS] }, oldData =>
          filterListDocuments(oldData, userDocument)
        )
      }
    }
  })

  return {
    updateDocument: mutate,
    isPending,
    isError
  }
}
