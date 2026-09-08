import { Button } from '../../components/ui/Button.tsx'

interface FullPageStatusProps {
  action?: () => void
  actionLabel?: string
  description: string
  title: string
}

export function FullPageStatus({
  action,
  actionLabel,
  description,
  title,
}: FullPageStatusProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-panel">
        <div
          aria-hidden="true"
          className="mx-auto grid size-12 place-items-center rounded-xl bg-brand-50 font-mono text-sm font-bold text-brand-700"
        >
          TF
        </div>
        <h1 className="mt-5 text-xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        {action && actionLabel ? (
          <Button className="mt-6" onClick={action}>
            {actionLabel}
          </Button>
        ) : (
          <div
            aria-label="Loading"
            className="mx-auto mt-6 size-6 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"
            role="status"
          />
        )}
      </section>
    </main>
  )
}
