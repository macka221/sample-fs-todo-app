interface TodoSummaryProps {
  completedCount: number
  openCount: number
  totalCount: number
}

interface SummaryCardProps {
  code: string
  label: string
  note: string
  value: string
}

function SummaryCard({ code, label, note, value }: SummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 tabular-nums">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{note}</p>
        </div>
        <span
          aria-hidden="true"
          className="grid size-9 place-items-center rounded-lg bg-slate-100 font-mono text-[0.6875rem] font-bold text-slate-600"
        >
          {code}
        </span>
      </div>
    </article>
  )
}

export function TodoSummary({
  completedCount,
  openCount,
  totalCount,
}: TodoSummaryProps) {
  const completionRate = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0

  const metrics: SummaryCardProps[] = [
    {
      code: 'ALL',
      label: 'Total todos',
      value: totalCount.toString(),
      note: 'All tracked work items',
    },
    {
      code: 'OPN',
      label: 'Open',
      value: openCount.toString(),
      note: 'Still needs attention',
    },
    {
      code: 'DON',
      label: 'Completed',
      value: completedCount.toString(),
      note: 'Finished work items',
    },
    {
      code: '%',
      label: 'Completion rate',
      value: `${completionRate}%`,
      note: 'Completed versus total',
    },
  ]

  return (
    <section
      aria-label="Todo summary"
      className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4"
    >
      {metrics.map((metric) => (
        <SummaryCard key={metric.code} {...metric} />
      ))}
    </section>
  )
}
