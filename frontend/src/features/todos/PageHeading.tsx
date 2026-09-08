import type { ReactNode } from 'react'

interface PageHeadingProps {
  action?: ReactNode
  description: string
  eyebrow: string
  title: string
}

export function PageHeading({
  action,
  description,
  eyebrow,
  title,
}: PageHeadingProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-brand-700 uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
      {action}
    </header>
  )
}
