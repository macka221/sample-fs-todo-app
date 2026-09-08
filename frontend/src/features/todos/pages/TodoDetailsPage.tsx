import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { ApiError } from '../../../api/errors.ts'
import { Button } from '../../../components/ui/Button.tsx'
import { Panel } from '../../../components/ui/Panel.tsx'
import { TextField } from '../../../components/ui/TextField.tsx'
import { PageHeading } from '../PageHeading.tsx'
import type { Todo } from '../todo.ts'
import {
  useDeleteTodoMutation,
  useTodoQuery,
  useUpdateTodoMutation,
} from '../todoQueries.ts'
import { TodoErrorState, TodoLoadingState } from '../TodoQueryState.tsx'

interface TodoEditFormProps {
  todo: Todo
}

function TodoEditForm({ todo }: TodoEditFormProps) {
  const navigate = useNavigate()
  const deleteTodo = useDeleteTodoMutation()
  const updateTodo = useUpdateTodoMutation()
  const [completed, setCompleted] = useState(todo.completed)
  const [description, setDescription] = useState(todo.description ?? '')
  const [title, setTitle] = useState(todo.title)
  const trimmedTitle = title.trim()
  const error = updateTodo.error ?? deleteTodo.error
  const isPending = updateTodo.isPending || deleteTodo.isPending

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await updateTodo.mutateAsync({
        todoId: todo.id,
        input: {
          completed,
          description: description.trim(),
          title: trimmedTitle,
        },
      })
      await navigate('/todos')
    } catch {
      // The mutation exposes the normalized error in the form below.
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${todo.title}"? This action cannot be undone.`,
    )
    if (!confirmed) {
      return
    }

    try {
      await deleteTodo.mutateAsync(todo.id)
      await navigate('/todos')
    } catch {
      // The mutation exposes the normalized error in the form below.
    }
  }

  return (
    <Panel
      description={`TD-${todo.id} · Created ${new Date(todo.created_at).toLocaleString()}`}
      title="Todo details"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <TextField
          label="Title"
          maxLength={255}
          minLength={1}
          onChange={(event) => setTitle(event.target.value)}
          required
          value={title}
        />
        <div>
          <label
            className="mb-1.5 block text-xs font-semibold text-slate-700"
            htmlFor="todo-description"
          >
            Description
          </label>
          <textarea
            className="min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-xs outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
            id="todo-description"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add helpful context"
            value={description}
          />
        </div>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700">
          <input
            checked={completed}
            className="size-4 accent-brand-600"
            onChange={(event) => setCompleted(event.target.checked)}
            type="checkbox"
          />
          Mark as completed
        </label>

        {error ? (
          <p
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            role="alert"
          >
            {error.message}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            disabled={isPending}
            onClick={() => void handleDelete()}
            type="button"
            variant="secondary"
          >
            {deleteTodo.isPending ? 'Deleting...' : 'Delete todo'}
          </Button>
          <div className="flex gap-3">
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              to="/todos"
            >
              Cancel
            </Link>
            <Button disabled={!trimmedTitle || isPending} type="submit">
              {updateTodo.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      </form>
    </Panel>
  )
}

export function TodoDetailsPage() {
  const { todoId: todoIdParam } = useParams()
  const todoId = Number(todoIdParam)
  const validTodoId = Number.isInteger(todoId) && todoId > 0 ? todoId : null
  const todoQuery = useTodoQuery(validTodoId)

  return (
    <div className="space-y-6">
      <PageHeading
        action={
          <Link
            className="text-sm font-semibold text-brand-700 hover:text-brand-800 hover:underline"
            to="/todos"
          >
            Back to registry
          </Link>
        }
        description="Review and update this Todo using the individual resource API."
        eyebrow="Work item"
        title="Todo details"
      />

      {validTodoId === null ? (
        <TodoErrorState
          error={new Error('The Todo ID in this URL is invalid.')}
          onRetry={() => window.history.back()}
        />
      ) : todoQuery.isPending ? (
        <TodoLoadingState label="Loading Todo details" />
      ) : todoQuery.isError ? (
        <TodoErrorState
          error={
            todoQuery.error instanceof ApiError && todoQuery.error.status === 404
              ? new Error('This Todo does not exist or is not available to you.')
              : todoQuery.error
          }
          onRetry={() => void todoQuery.refetch()}
        />
      ) : (
        <TodoEditForm key={todoQuery.data.updated_at} todo={todoQuery.data} />
      )}
    </div>
  )
}
