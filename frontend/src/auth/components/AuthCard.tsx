import type { ReactNode } from 'react'

interface AuthCardProps {
  children: ReactNode
  description: string
  footer: ReactNode
  title: string
}

export function AuthCard({
  children,
  description,
  footer,
  title,
}: AuthCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-panel sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-7">{children}</div>
      <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
        {footer}
      </div>
    </section>
  )
}
