import { useContext } from 'react'

// Context Imports
import { CategoriesContext } from '@/contexts/CategoriesProvider'

export const useCategoriesContext = () => {
  // Hooks
  const context = useContext(CategoriesContext)

  if (!context) {
    throw new Error('useCategoriesContext must be used within a CategoriesProvider')
  }

  return context
}
