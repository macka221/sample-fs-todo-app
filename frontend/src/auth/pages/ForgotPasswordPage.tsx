import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import { Button } from '../../components/ui/Button.tsx'
import { TextField } from '../../components/ui/TextField.tsx'
import { useAuth } from '../authContextValue.ts'
import { getAuthErrorMessage } from '../authErrors.ts'
import { AuthCard } from '../components/AuthCard.tsx'

export function ForgotPasswordPage() {
  const { resetPassword, status } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const isConfigured = status !== 'configuration-error'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await resetPassword(email.trim())
      setIsSubmitted(true)
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      description="Firebase will send a secure reset link to your email address."
      footer={
        <Link
          className="font-semibold text-brand-700 hover:text-brand-800 hover:underline"
          to="/login"
        >
          Return to sign in
        </Link>
      }
      title="Reset your password"
    >
      {isSubmitted ? (
        <div
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"
          role="status"
        >
          If an account exists for <strong>{email}</strong>, check your inbox for
          the password reset email.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            autoComplete="email"
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />

          {error ? (
            <p
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-5 text-rose-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <Button
            className="w-full"
            disabled={!isConfigured || isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Sending reset email...' : 'Send reset email'}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
