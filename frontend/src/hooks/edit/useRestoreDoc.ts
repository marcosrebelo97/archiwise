'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { documentsService } from '@/services/requests/documents'
import { Queries } from '@/types/queries'
import { addDocumentToList, filterListDocuments } from '@/hooks/edit/useUpdateMetadadoDoc'
import type { UserDocument } from '@/types/project'

export const useRestoreDoc = () => {
  const queryClient = useQueryClient()

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (id: string) => {
      try {
        return await documentsService.restoreOne(id, { isDeleted: false })
      } catch (error) {
        console.error('Erro ao restaurar arquivo:', error)
        throw error
      }
    },

    onSuccess(documentUser) {
      queryClient.setQueriesData<UserDocument[]>({ queryKey: [Queries.LIST_ALL_DOCUMENTS] }, oldData =>
        addDocumentToList(oldData, documentUser)
      )
      queryClient.setQueriesData<UserDocument[]>({ queryKey: [Queries.LIST_DOCS_TRASH] }, oldData =>
        filterListDocuments(oldData, documentUser)
      )

      if (documentUser.isFavorite) {
        queryClient.setQueriesData<UserDocument[]>({ queryKey: [Queries.LIST_FAVORITE_DOCS] }, oldData =>
          addDocumentToList(oldData, documentUser)
        )
      }

      if (documentUser.categoryId) {
        queryClient.setQueriesData<UserDocument[]>(
          { queryKey: [Queries.LIST_DOCUMENTS_BY_CATEGORY, documentUser.categoryId] },
          oldData => addDocumentToList(oldData, documentUser)
        )
      }
    }
  })

  return {
    restoreDocument: mutate,
    isPending,
    isError
  }
}
