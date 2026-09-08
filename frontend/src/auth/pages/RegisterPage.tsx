import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import { Button } from '../../components/ui/Button.tsx'
import { TextField } from '../../components/ui/TextField.tsx'
import { useAuth } from '../authContextValue.ts'
import { getAuthErrorMessage } from '../authErrors.ts'
import { AuthCard } from '../components/AuthCard.tsx'

export function RegisterPage() {
  const { register, status } = useAuth()
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState('')
  const isConfigured = status !== 'configuration-error'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      await register(email.trim(), password)
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError))
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      description="Create a Firebase account to start your personal Todo workspace."
      footer={
        <>
          Already have an account?{' '}
          <Link
            className="font-semibold text-brand-700 hover:text-brand-800 hover:underline"
            to="/login"
          >
            Sign in
          </Link>
        </>
      }
      title="Create your account"
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
          autoComplete="new-password"
          hint="Use at least six characters."
          label="Password"
          minLength={6}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
          required
          type="password"
          value={password}
        />
        <TextField
          autoComplete="new-password"
          label="Confirm password"
          minLength={6}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Repeat your password"
          required
          type="password"
          value={confirmPassword}
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
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthCard>
  )
}
