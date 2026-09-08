import { apiConfig } from '../../api/config.ts'
import { useHealthQuery } from './useHealthQuery.ts'

export function ServiceStatus() {
  const healthQuery = useHealthQuery()

  const state = healthQuery.isPending
    ? { color: 'bg-amber-400', label: 'Checking service' }
    : healthQuery.isError
      ? { color: 'bg-rose-500', label: 'Service unavailable' }
      : { color: 'bg-emerald-500', label: 'Service available' }

  return (
    <button
      aria-label={`${state.label}. Using ${apiConfig.mode} connection mode. Refresh service status.`}
      className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-xs outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      onClick={() => void healthQuery.refetch()}
      type="button"
    >
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${state.color} ${healthQuery.isFetching ? 'animate-pulse' : ''}`}
      />
      <span className="hidden md:inline">{state.label}</span>
    </button>
  )
}
