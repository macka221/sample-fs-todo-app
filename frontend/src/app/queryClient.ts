import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'

import { ApiError } from '../api/errors.ts'
import {
  getFirebaseAuth,
  isFirebaseConfigured,
} from '../auth/firebaseClient.ts'

function handleAuthenticationError(error: unknown) {
  if (error instanceof ApiError && error.status === 401 && isFirebaseConfigured) {
    void signOut(getFirebaseAuth())
  }
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({ onError: handleAuthenticationError }),
  queryCache: new QueryCache({ onError: handleAuthenticationError }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
})
