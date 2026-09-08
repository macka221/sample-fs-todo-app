import { Outlet } from 'react-router'

import { useAuth } from '../authContextValue.ts'

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="grid size-10 shrink-0 grid-cols-2 gap-1 rounded-lg bg-brand-600 p-2 shadow-lg shadow-brand-950/30"
      >
        <span className="rounded-[2px] bg-white" />
        <span className="rounded-[2px] bg-brand-200" />
        <span className="rounded-[2px] bg-brand-200" />
        <span className="rounded-[2px] bg-white" />
      </div>
      <div>
        <p className="text-base font-bold tracking-wide text-slate-950 lg:text-white">
          TaskFlow
        </p>
        <p className="text-[0.6875rem] font-medium tracking-wider text-slate-500 uppercase lg:text-slate-400">
          Todo workspace
        </p>
      </div>
    </div>
  )
}

export function AuthLayout() {
  const { missingConfiguration, status } = useAuth()

  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-[minmax(22rem,0.85fr)_minmax(30rem,1.15fr)]">
      <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col xl:p-14">
        <div
          aria-hidden="true"
          className="absolute -top-28 -right-32 size-96 rounded-full bg-brand-500/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-36 -left-32 size-96 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div className="relative">
          <Brand />
        </div>

        <div className="relative my-auto max-w-xl py-14">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand-300 uppercase">
            Plan. Complete. Improve.
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance xl:text-5xl">
            Keep every commitment visible and moving forward.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 xl:text-base">
            Capture tasks, monitor progress, and move work to completion from a
            focused personal workspace.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {['Clear priorities', 'Live progress', 'Secure access'].map(
              (item, index) => (
                <div
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                  key={item}
                >
                  <p className="font-mono text-xs text-brand-300">
                    0{index + 1}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-slate-100">
                    {item}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>

        <p className="relative text-xs text-slate-500">
          Authentication secured by Firebase
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>

          {status === 'configuration-error' ? (
            <div
              className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
              role="alert"
            >
              <p className="font-semibold">Firebase configuration incomplete</p>
              <p className="mt-1 text-xs leading-5">
                Add the following value{missingConfiguration.length === 1 ? '' : 's'}
                {' '}to <code className="font-mono">frontend/.env.local</code>,
                then restart Vite:
              </p>
              <ul className="mt-2 space-y-1 font-mono text-xs">
                {missingConfiguration.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <Outlet />
        </div>
      </section>
    </main>
  )
}
