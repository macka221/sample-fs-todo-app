import { Panel } from '../../components/ui/Panel.tsx'

interface CompletionChartProps {
  completedCount: number
  openCount: number
}

export function CompletionChart({
  completedCount,
  openCount,
}: CompletionChartProps) {
  const totalCount = completedCount + openCount
  const completionRate = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0

  return (
    <Panel
      description="A live view of open versus completed work."
      title="Completion overview"
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <div
          aria-label={`${completionRate}% of todos completed`}
          className="relative grid size-40 shrink-0 place-items-center rounded-full"
          role="img"
          style={{
            background: `conic-gradient(var(--color-emerald-500) 0 ${completionRate}%, var(--color-slate-200) ${completionRate}% 100%)`,
          }}
        >
          <div className="grid size-28 place-items-center rounded-full bg-white shadow-inner">
            <div className="text-center">
              <p className="text-3xl font-semibold tracking-tight text-slate-950 tabular-nums">
                {completionRate}%
              </p>
              <p className="mt-1 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase">
                complete
              </p>
            </div>
          </div>
        </div>

        <dl className="grid w-full max-w-xs grid-cols-2 gap-3 sm:grid-cols-1">
          <div className="rounded-lg border border-slate-200 p-3">
            <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-brand-500"
              />
              Open
            </dt>
            <dd className="mt-1 text-xl font-semibold text-slate-950 tabular-nums">
              {openCount}
            </dd>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-emerald-500"
              />
              Completed
            </dt>
            <dd className="mt-1 text-xl font-semibold text-slate-950 tabular-nums">
              {completedCount}
            </dd>
          </div>
        </dl>
      </div>
    </Panel>
  )
}
