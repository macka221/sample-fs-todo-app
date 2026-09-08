import type { ReactNode } from 'react'

interface PanelProps {
  action?: ReactNode
  bodyClassName?: string
  children: ReactNode
  className?: string
  description?: string
  title: string
}

export function Panel({
  action,
  bodyClassName = '',
  children,
  className = '',
  description,
  title,
}: PanelProps) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-panel ${className}`}
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      <div className={`p-5 sm:p-6 ${bodyClassName}`}>{children}</div>
    </section>
  )
}
