import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '../authContextValue.ts'
import { FullPageStatus } from './FullPageStatus.tsx'

export function PublicOnlyRoute() {
  const { error, retrySession, status } = useAuth()
  const location = useLocation()
  const destination =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state &&
    typeof location.state.from === 'string'
      ? location.state.from
      : '/dashboard'

  if (status === 'loading') {
    return (
      <FullPageStatus
        description="Restoring your Firebase and Todo API session."
        title="Signing you in"
      />
    )
  }

  if (status === 'error') {
    return (
      <FullPageStatus
        action={() => void retrySession()}
        actionLabel="Try again"
        description={error ?? 'The backend session could not be created.'}
        title="Session unavailable"
      />
    )
  }

  return status === 'authenticated' ? (
    <Navigate replace to={destination} />
  ) : (
    <Outlet />
  )
}

export function ProtectedRoute() {
  const { error, retrySession, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <FullPageStatus
        description="Restoring your Firebase and Todo API session."
        title="Loading workspace"
      />
    )
  }

  if (status === 'configuration-error') {
    return <Navigate replace to="/login" />
  }

  if (status === 'error') {
    return (
      <FullPageStatus
        action={() => void retrySession()}
        actionLabel="Try again"
        description={error ?? 'The backend session could not be created.'}
        title="Session unavailable"
      />
    )
  }

  return status === 'authenticated' ? (
    <Outlet />
  ) : (
    <Navigate replace state={{ from: location.pathname }} to="/login" />
  )
}
