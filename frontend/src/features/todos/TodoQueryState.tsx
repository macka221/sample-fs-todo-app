import { Button } from '../../components/ui/Button.tsx'

interface TodoLoadingStateProps {
  label: string
}

interface TodoErrorStateProps {
  error: Error
  onRetry: () => void
}

export function TodoLoadingState({ label }: TodoLoadingStateProps) {
  return (
    <section
      aria-label={label}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-panel"
    >
      <div className="space-y-3 animate-pulse">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="h-20 rounded-lg bg-slate-100" />
        <div className="h-20 rounded-lg bg-slate-100" />
      </div>
    </section>
  )
}

export function TodoErrorState({ error, onRetry }: TodoErrorStateProps) {
  return (
    <section className="rounded-xl border border-rose-200 bg-white p-6 shadow-panel">
      <p className="text-sm font-semibold text-slate-900">
        Todos could not be loaded
      </p>
      <p className="mt-2 text-sm leading-6 text-rose-700" role="alert">
        {error.message}
      </p>
      <Button className="mt-5" onClick={onRetry} variant="secondary">
        Try again
      </Button>
    </section>
  )
}
