'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { documentsService } from '@/services/requests/documents'
import type { UpdateUserDocument, UserDocument } from '@/types/project'
import { Queries } from '@/types/queries'

export function updateListDocuments(oldData: UserDocument[] | undefined, userDocument: UserDocument) {
  if (!oldData) return []

  return oldData.map(doc => {
    if (doc.id === userDocument.id) {
      return userDocument
    }

    return doc
  })
}

export function filterListDocuments(oldData: UserDocument[] | undefined, userDocument: UserDocument) {
  if (!oldData) return []

  return oldData.filter(doc => doc.id !== userDocument.id)
}

export function addDocumentToList(oldData: UserDocument[] | undefined, userDocument: UserDocument) {
  if (!oldData) return []

  return [userDocument, ...oldData]
}

export const useUpdateMetadadoDoc = () => {
  const queryClient = useQueryClient()

  const queriesToUpdate = [
    Queries.LIST_ALL_DOCUMENTS,
    Queries.LIST_DOCUMENTS_BY_CATEGORY,
    Queries.LIST_FAVORITE_DOCS,
    Queries.SEARCH_DOCUMENTS
  ]

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserDocument }) => documentsService.update(id, payload),
    onSuccess: userDocument => {
      queriesToUpdate.forEach(queryKey => {
        queryClient.setQueriesData<UserDocument[]>({ queryKey: [queryKey] }, oldData =>
          updateListDocuments(oldData, userDocument)
        )
      })
    }
  })

  return {
    updateDocument: mutate,
    isPending,
    isError
  }
}
