'use client'
import { useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface ReactQueryClientProviderProps {
  children: React.ReactNode
}

export default function ReactQueryClientProvider({ children }: ReactQueryClientProviderProps) {
  const [queryClient] = useState(() => new QueryClient())

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
