import { FirebaseError } from 'firebase/app'

const friendlyMessages: Record<string, string> = {
  'auth/email-already-in-use': 'An account already exists for this email.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/network-request-failed': 'Firebase could not be reached. Check your connection.',
  'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/weak-password': 'Use a stronger password with at least six characters.',
}

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    return friendlyMessages[error.code] ?? 'Firebase could not complete the request.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Authentication could not be completed.'
}
