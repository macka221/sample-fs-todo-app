import { createContext, use } from 'react'
import type { UserOut } from 'todo-api-client'

export type AuthStatus =
  | 'authenticated'
  | 'configuration-error'
  | 'error'
  | 'loading'
  | 'unauthenticated'

export interface AuthContextValue {
  error: string | null
  missingConfiguration: string[]
  register: (email: string, password: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  retrySession: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  status: AuthStatus
  user: UserOut | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
