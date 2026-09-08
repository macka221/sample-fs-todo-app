import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import { Button } from '../../components/ui/Button.tsx'
import { TextField } from '../../components/ui/TextField.tsx'
import { useAuth } from '../authContextValue.ts'
import { getAuthErrorMessage } from '../authErrors.ts'
import { AuthCard } from '../components/AuthCard.tsx'

export function LoginPage() {
  const { signIn, status } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState('')
  const isConfigured = status !== 'configuration-error'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await signIn(email.trim(), password)
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError))
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      description="Use your Firebase email and password to open your workspace."
      footer={
        <>
          New to TaskFlow?{' '}
          <Link
            className="font-semibold text-brand-700 hover:text-brand-800 hover:underline"
            to="/register"
          >
            Create an account
          </Link>
        </>
      }
      title="Welcome back"
    >
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
        <TextField
          autoComplete="current-password"
          label="Password"
          minLength={6}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          required
          type="password"
          value={password}
        />

        <div className="flex justify-end">
          <Link
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline"
            to="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>

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
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthCard>
  )
}
