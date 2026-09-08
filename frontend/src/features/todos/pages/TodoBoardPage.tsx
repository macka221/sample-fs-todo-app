import { PageHeading } from '../PageHeading.tsx'
import { TodoBoard } from '../TodoBoard.tsx'
import { TodoErrorState, TodoLoadingState } from '../TodoQueryState.tsx'
import { useTodosQuery, useUpdateTodoMutation } from '../todoQueries.ts'

export function TodoBoardPage() {
  const todosQuery = useTodosQuery()
  const updateTodo = useUpdateTodoMutation()

  function changeStatus(todoId: number, completed: boolean) {
    updateTodo.mutate({ todoId, input: { completed } })
  }

  return (
    <div className="space-y-6">
      <PageHeading
        description="Move work between Open and Completed with drag-and-drop or accessible action buttons."
        eyebrow="Visual workflow"
        title="Work board"
      />
      {updateTodo.isError ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          role="alert"
        >
          {updateTodo.error.message}
        </p>
      ) : null}
      {todosQuery.isPending ? (
        <TodoLoadingState label="Loading work board" />
      ) : todosQuery.isError ? (
        <TodoErrorState
          error={todosQuery.error}
          onRetry={() => void todosQuery.refetch()}
        />
      ) : (
        <TodoBoard
          isUpdating={updateTodo.isPending}
          onStatusChange={changeStatus}
          todos={todosQuery.data}
        />
      )}
    </div>
  )
}
