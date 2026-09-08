import {
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { UserOut } from 'todo-api-client'

import { authApi, createAuthenticatedApi } from '../api/client.ts'
import { queryClient } from '../app/queryClient.ts'
import {
  getFirebaseAuth,
  isFirebaseConfigured,
  missingFirebaseVariables,
} from './firebaseClient.ts'
import { AuthContext, type AuthStatus } from './authContextValue.ts'

interface AuthProviderProps {
  children: ReactNode
}

interface SessionState {
  error: string | null
  status: AuthStatus
  user: UserOut | null
}

async function synchronizeBackendSession(firebaseUser: User) {
  const idToken = await firebaseUser.getIdToken()
  await authApi.signIn(idToken)

  const authenticatedApi = createAuthenticatedApi(() =>
    firebaseUser.getIdToken(),
  )
  return authenticatedApi.user.current()
}

function readSessionError(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'The authenticated backend session could not be created.'
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<SessionState>(() =>
    isFirebaseConfigured
      ? { error: null, status: 'loading', user: null }
      : {
          error: 'Firebase Web App configuration is incomplete.',
          status: 'configuration-error',
          user: null,
        },
  )

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return
    }

    let isActive = true
    const unsubscribe = onIdTokenChanged(getFirebaseAuth(), (firebaseUser) => {
      if (!firebaseUser) {
        queryClient.clear()
        setSession({ error: null, status: 'unauthenticated', user: null })
        return
      }

      setSession((currentSession) =>
        currentSession.status === 'authenticated'
          ? currentSession
          : { error: null, status: 'loading', user: null },
      )
      void synchronizeBackendSession(firebaseUser)
        .then((backendUser) => {
          if (isActive) {
            setSession({
              error: null,
              status: 'authenticated',
              user: backendUser,
            })
          }
        })
        .catch((error: unknown) => {
          if (isActive) {
            setSession({
              error: readSessionError(error),
              status: 'error',
              user: null,
            })
          }
        })
    })

    return () => {
      isActive = false
      unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
  }

  async function register(email: string, password: string) {
    await createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(getFirebaseAuth(), email)
  }

  async function signOut() {
    await firebaseSignOut(getFirebaseAuth())
    queryClient.clear()
    setSession({ error: null, status: 'unauthenticated', user: null })
  }

  async function retrySession() {
    const firebaseUser = getFirebaseAuth().currentUser
    if (!firebaseUser) {
      setSession({ error: null, status: 'unauthenticated', user: null })
      return
    }

    setSession({ error: null, status: 'loading', user: null })
    try {
      const backendUser = await synchronizeBackendSession(firebaseUser)
      setSession({
        error: null,
        status: 'authenticated',
        user: backendUser,
      })
    } catch (error) {
      setSession({
        error: readSessionError(error),
        status: 'error',
        user: null,
      })
    }
  }

  return (
    <AuthContext
      value={{
        error: session.error,
        missingConfiguration: missingFirebaseVariables,
        register,
        resetPassword,
        retrySession,
        signIn,
        signOut,
        status: session.status,
        user: session.user,
      }}
    >
      {children}
    </AuthContext>
  )
}
