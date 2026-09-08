import { CompletionChart } from '../CompletionChart.tsx'
import { PageHeading } from '../PageHeading.tsx'
import { QuickAddTodo } from '../QuickAddTodo.tsx'
import { TodoErrorState, TodoLoadingState } from '../TodoQueryState.tsx'
import { useCreateTodoMutation, useTodosQuery } from '../todoQueries.ts'
import { TodoSummary } from '../TodoSummary.tsx'

export function DashboardPage() {
  const todosQuery = useTodosQuery()
  const createTodo = useCreateTodoMutation()
  const todos = todosQuery.data ?? []
  const completedCount = todos.filter((todo) => todo.completed).length
  const openCount = todos.length - completedCount

  return (
    <div className="space-y-6">
      <PageHeading
        action={
          <p className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-xs">
            Last updated just now
          </p>
        }
        description="Review workload, monitor completion, and capture a new item."
        eyebrow="Personal productivity"
        title="Todo dashboard"
      />

      {todosQuery.isPending ? (
        <TodoLoadingState label="Loading Todo dashboard" />
      ) : todosQuery.isError ? (
        <TodoErrorState
          error={todosQuery.error}
          onRetry={() => void todosQuery.refetch()}
        />
      ) : (
        <>
          <TodoSummary
            completedCount={completedCount}
            openCount={openCount}
            totalCount={todos.length}
          />

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(19rem,0.6fr)]">
            <CompletionChart
              completedCount={completedCount}
              openCount={openCount}
            />
            <QuickAddTodo
              onAdd={async (draft) => {
                await createTodo.mutateAsync(draft)
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
