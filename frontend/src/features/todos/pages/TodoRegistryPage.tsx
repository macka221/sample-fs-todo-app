import { PageHeading } from '../PageHeading.tsx'
import { TodoRegistry } from '../TodoRegistry.tsx'
import { TodoErrorState, TodoLoadingState } from '../TodoQueryState.tsx'
import { useTodosQuery } from '../todoQueries.ts'

export function TodoRegistryPage() {
  const todosQuery = useTodosQuery()

  return (
    <div className="space-y-6">
      <PageHeading
        description="Search titles and descriptions, then filter the complete work register by status."
        eyebrow="Work inventory"
        title="Todo registry"
      />
      {todosQuery.isPending ? (
        <TodoLoadingState label="Loading Todo registry" />
      ) : todosQuery.isError ? (
        <TodoErrorState
          error={todosQuery.error}
          onRetry={() => void todosQuery.refetch()}
        />
      ) : (
        <TodoRegistry todos={todosQuery.data} />
      )}
    </div>
  )
}
