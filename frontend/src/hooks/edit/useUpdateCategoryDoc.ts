'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { documentsService } from '@/services/requests/documents'
import type { UpdateUserDocument, UserDocument } from '@/types/project'
import { Queries } from '@/types/queries'
import { addDocumentToList, filterListDocuments, updateListDocuments } from '@/hooks/edit/useUpdateMetadadoDoc'

export const useUpdateCategoryDoc = () => {
  const queryClient = useQueryClient()
  const queriesToUpdate = [Queries.LIST_ALL_DOCUMENTS, Queries.LIST_FAVORITE_DOCS, Queries.SEARCH_DOCUMENTS]

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserDocument; idOldCategory: string | undefined }) =>
      documentsService.update(id, payload),
    onSuccess: (userDocument, updateDocument) => {
      queriesToUpdate.forEach(queryKey => {
        queryClient.setQueriesData<UserDocument[]>({ queryKey: [queryKey] }, oldData =>
          updateListDocuments(oldData, userDocument)
        )
      })
      const newCategoryId = userDocument.categoryId
      const oldCategoryId = updateDocument.idOldCategory

      if (oldCategoryId) {
        queryClient.setQueriesData<UserDocument[]>(
          { queryKey: [Queries.LIST_DOCUMENTS_BY_CATEGORY, oldCategoryId] },
          oldData => filterListDocuments(oldData, userDocument)
        )
      }

      queryClient.setQueriesData<UserDocument[]>(
        { queryKey: [Queries.LIST_DOCUMENTS_BY_CATEGORY, newCategoryId] },
        oldData => addDocumentToList(oldData, userDocument)
      )
    }
  })

  return {
    updateDocument: mutate,
    isPending,
    isError
  }
}
