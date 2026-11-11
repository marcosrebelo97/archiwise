import { useMutation } from "@tanstack/react-query"

import { createSearch } from "@/services/requests/search"

export const useRegisterSearch = () => {
  const {mutate: onRegisterSearch} = useMutation({
    mutationFn: (termSearched: string) => createSearch({termSearched}),
  })

  return {onRegisterSearch}
}
