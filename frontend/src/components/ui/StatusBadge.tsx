import type { ReactNode } from 'react'

export type StatusTone = 'success' | 'warning' | 'info' | 'neutral'

interface StatusBadgeProps {
  children: ReactNode
  tone?: StatusTone
}

const toneStyles: Record<StatusTone, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  info: 'border-brand-200 bg-brand-50 text-brand-700',
  neutral: 'border-slate-200 bg-slate-100 text-slate-600',
}

const dotStyles: Record<StatusTone, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  info: 'bg-brand-500',
  neutral: 'bg-slate-400',
}

export function StatusBadge({
  children,
  tone = 'neutral',
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide ${toneStyles[tone]}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${dotStyles[tone]}`}
      />
      {children}
    </span>
  )
}
