import { useQuery } from "@tanstack/react-query"

import { documentsService } from "@/services/requests/documents"
import { Queries } from "@/types/queries"

export const useDetailsDoc = (docId: string) => {
  return useQuery({
    queryKey: [Queries.DETAILS_DOCUMENT, docId],
    queryFn: () => documentsService.findOne(docId),
  })
}
