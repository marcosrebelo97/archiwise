import { useMutation, useQueryClient } from '@tanstack/react-query'

import { documentsService } from '@/services/requests/documents'
import { Queries } from '@/types/queries'
import type { UserDocument } from '@/types/project'

export const useDeleteDocument = () => {
  const queryClient = useQueryClient()

  const {
    mutate: onDeleteDocument,
    isPending,
    isError
  } = useMutation({
    mutationFn: (docId: string) => documentsService.deleteOne(docId),
    onSuccess(_, docId) {
      queryClient.setQueriesData<UserDocument[]>({ queryKey: [Queries.LIST_DOCS_TRASH] }, oldData => {
        if (!oldData) return []

        return oldData.filter(doc => doc.id !== docId)
      })
    }
  })

  return { onDeleteDocument, isPending, isError }
}
