import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

import { AuthProvider } from '../auth/AuthContext.tsx'
import { queryClient } from './queryClient.ts'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
