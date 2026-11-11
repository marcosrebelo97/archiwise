import { useContext } from 'react'

// Context Imports
import { ViewPDFContext } from '@/contexts/ViewPDFProvider'

export const useViewPDFContext = () => {
  // Hooks
  const context = useContext(ViewPDFContext)

  if (!context) {
    throw new Error('useViewPDFContext must be used within an ViewPDFProvider')
  }

  return context
}
