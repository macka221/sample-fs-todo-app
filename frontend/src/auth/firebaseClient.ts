import { getApp, getApps, initializeApp, type FirebaseOptions } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const environmentValues = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
} as const

export const missingFirebaseVariables = Object.entries(environmentValues)
  .filter(([, value]) => !value?.trim())
  .map(([key]) => key)

export const isFirebaseConfigured = missingFirebaseVariables.length === 0

let auth: Auth | undefined

export function getFirebaseAuth() {
  if (!isFirebaseConfigured) {
    throw new Error(
      `Missing Firebase configuration: ${missingFirebaseVariables.join(', ')}`,
    )
  }

  if (!auth) {
    const options: FirebaseOptions = {
      apiKey: environmentValues.VITE_FIREBASE_API_KEY,
      authDomain: environmentValues.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: environmentValues.VITE_FIREBASE_PROJECT_ID,
      storageBucket: environmentValues.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId:
        environmentValues.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: environmentValues.VITE_FIREBASE_APP_ID,
    }
    const app = getApps().length ? getApp() : initializeApp(options)
    auth = getAuth(app)
  }

  return auth
}

export async function getFirebaseIdToken() {
  const user = getFirebaseAuth().currentUser
  if (!user) {
    throw new Error('A Firebase user must be signed in before calling the API.')
  }

  return user.getIdToken()
}
