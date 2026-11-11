import { useContext } from 'react'

// Context Imports
import { SearchContext } from '@/contexts/SearchProvider'

export const useSearchContext = () => {
  // Hooks
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error('useCategoriesContext must be used within a SearchProvider')
  }

  return context
}
