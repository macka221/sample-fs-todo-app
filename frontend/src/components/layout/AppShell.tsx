import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'

import { useAuth } from '../../auth/authContextValue.ts'
import { ServiceStatus } from '../../features/health/ServiceStatus.tsx'
import { Button } from '../ui/Button.tsx'

interface BrandProps {
  inverse?: boolean
}

interface NavigationProps {
  onNavigate?: () => void
}

const navigationItems = [
  { code: 'DB', label: 'Dashboard', path: '/dashboard' },
  { code: 'WB', label: 'Work board', path: '/board' },
  { code: 'TR', label: 'Todo registry', path: '/todos' },
] as const

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/board': 'Work board',
  '/todos': 'Todo registry',
}

function Brand({ inverse = false }: BrandProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="grid size-9 shrink-0 grid-cols-2 gap-1 rounded-lg bg-brand-600 p-2 shadow-lg shadow-brand-950/30"
      >
        <span className="rounded-[2px] bg-white" />
        <span className="rounded-[2px] bg-brand-200" />
        <span className="rounded-[2px] bg-brand-200" />
        <span className="rounded-[2px] bg-white" />
      </div>
      <div>
        <p
          className={`text-sm font-bold tracking-wide ${inverse ? 'text-white' : 'text-slate-950'}`}
        >
          TaskFlow
        </p>
        <p
          className={`text-[0.6875rem] font-medium tracking-wider uppercase ${inverse ? 'text-slate-400' : 'text-slate-500'}`}
        >
          Todo workspace
        </p>
      </div>
    </div>
  )
}

function Navigation({ onNavigate }: NavigationProps) {
  return (
    <nav aria-label="Primary navigation">
      <p className="mb-2 px-3 text-[0.6875rem] font-semibold tracking-[0.14em] text-slate-500 uppercase">
        Workspace
      </p>
      <ul className="space-y-1">
        {navigationItems.map((item) => (
          <li key={item.code}>
            <NavLink
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-300 ${
                  isActive
                    ? 'bg-white/10 font-semibold text-white ring-1 ring-white/10 hover:bg-white/15'
                    : 'font-medium text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
              onClick={onNavigate}
              to={item.path}
            >
              {({ isActive }) => (
                <>
                  <span
                    aria-hidden="true"
                    className={`grid size-7 place-items-center rounded-md text-[0.625rem] font-bold tracking-wider ${
                      isActive
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.code}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function AppShell() {
  const { signOut, user } = useAuth()
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false)
  const location = useLocation()
  const currentTitle = location.pathname.startsWith('/todos/')
    ? 'Todo details'
    : (routeTitles[location.pathname] ?? 'Dashboard')
  const email = user?.email ?? 'Authenticated user'
  const initials = email.slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <a
        className="fixed top-3 left-3 z-50 -translate-y-20 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg outline-none transition-transform focus:translate-y-0 focus:ring-2 focus:ring-brand-500"
        href="#main-content"
      >
        Skip to main content
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-slate-950 px-5 py-6 lg:flex">
        <Brand inverse />

        <div className="mt-10 flex-1">
          <Navigation />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs font-semibold text-slate-200">Stay on track</p>
          <p className="mt-1.5 text-[0.6875rem] leading-5 text-slate-400">
            Move work from open to completed and monitor progress from one
            workspace.
          </p>
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-slate-800 pt-5">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white"
          >
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-200">
              {email}
            </p>
            <button
              className="mt-0.5 cursor-pointer text-[0.6875rem] font-medium text-slate-500 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
              onClick={() => void signOut()}
              type="button"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <div className="lg:hidden">
              <Brand />
            </div>

            <div className="hidden lg:block">
              <p className="text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase">
                Personal workspace / {currentTitle}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">
                Todo management
              </p>
            </div>

            <div className="ml-auto hidden items-center gap-2.5 sm:flex">
              <ServiceStatus />
              <div className="mx-1 h-7 w-px bg-slate-200" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="grid size-8 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white"
              >
                {initials}
              </span>
              <div className="hidden xl:block">
                <p className="max-w-44 truncate text-xs font-semibold text-slate-800">
                  {email}
                </p>
                <button
                  className="cursor-pointer text-[0.6875rem] text-slate-500 hover:text-slate-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  onClick={() => void signOut()}
                  type="button"
                >
                  Sign out
                </button>
              </div>
            </div>

            <button
              aria-controls="mobile-navigation"
              aria-expanded={isMobileNavigationOpen}
              aria-label={
                isMobileNavigationOpen ? 'Close navigation' : 'Open navigation'
              }
              className="ml-auto grid size-10 cursor-pointer place-items-center rounded-lg border border-slate-700 bg-slate-900 text-white outline-none transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 lg:hidden"
              onClick={() => setIsMobileNavigationOpen((current) => !current)}
              type="button"
            >
              <span className="space-y-1" aria-hidden="true">
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-4 rounded-full bg-current" />
              </span>
            </button>
          </div>

          {isMobileNavigationOpen ? (
            <div
              className="border-t border-slate-800 bg-slate-950 px-4 py-5 lg:hidden"
              id="mobile-navigation"
            >
              <Navigation onNavigate={() => setIsMobileNavigationOpen(false)} />
              <Button
                className="mt-4 w-full"
                onClick={() => void signOut()}
                variant="secondary"
              >
                Sign out
              </Button>
            </div>
          ) : null}
        </header>

        <main
          className="mx-auto w-full max-w-[100rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
          id="main-content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
