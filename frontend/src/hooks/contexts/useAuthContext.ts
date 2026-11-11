import { useContext } from 'react'

// Context Imports
import { AuthContext } from '@/contexts/AuthProvider'

export const useAuthContext = () => {
  // Hooks
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }

  return context
}
