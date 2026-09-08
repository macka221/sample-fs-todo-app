import { useState, type DragEvent } from 'react'
import { Link } from 'react-router'

import { Button } from '../../components/ui/Button.tsx'
import { StatusBadge } from '../../components/ui/StatusBadge.tsx'
import type { Todo } from './todo.ts'

interface TodoBoardProps {
  isUpdating?: boolean
  onStatusChange: (todoId: number, completed: boolean) => void
  todos: Todo[]
}

interface BoardColumnProps {
  completed: boolean
  isUpdating: boolean
  onDropTodo: (todoId: number, completed: boolean) => void
  onStatusChange: (todoId: number, completed: boolean) => void
  todos: Todo[]
}

interface TodoCardProps {
  isUpdating: boolean
  onStatusChange: (todoId: number, completed: boolean) => void
  todo: Todo
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(value))
}

function TodoCard({ isUpdating, onStatusChange, todo }: TodoCardProps) {
  function handleDragStart(event: DragEvent<HTMLElement>) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', todo.id.toString())
  }

  return (
    <article
      className="cursor-grab rounded-lg border border-slate-200 bg-white p-4 shadow-xs transition-shadow hover:shadow-md active:cursor-grabbing"
      draggable={!isUpdating}
      onDragStart={handleDragStart}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-5 text-slate-900">
          {todo.title}
        </h3>
        <span className="shrink-0 font-mono text-[0.625rem] text-slate-400">
          TD-{todo.id}
        </span>
      </div>
      {todo.description ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {todo.description}
        </p>
      ) : null}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span className="text-[0.6875rem] text-slate-400">
          Updated {formatDate(todo.updated_at)}
        </span>
        <div className="flex items-center gap-1">
          <Link
            className="inline-flex min-h-9 items-center rounded-lg px-2 text-xs font-semibold text-brand-700 hover:bg-brand-50 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            to={`/todos/${todo.id}`}
          >
            View
          </Link>
          <Button
            disabled={isUpdating}
            onClick={() => onStatusChange(todo.id, !todo.completed)}
            size="sm"
            variant="ghost"
          >
            {todo.completed ? 'Reopen' : 'Complete'}
          </Button>
        </div>
      </div>
    </article>
  )
}

function BoardColumn({
  completed,
  isUpdating,
  onDropTodo,
  onStatusChange,
  todos,
}: BoardColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const title = completed ? 'Completed' : 'Open'

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragOver(false)

    if (isUpdating) {
      return
    }

    const todoId = Number(event.dataTransfer.getData('text/plain'))
    if (Number.isInteger(todoId)) {
      onDropTodo(todoId, completed)
    }
  }

  return (
    <section
      aria-label={`${title} todos`}
      className={`rounded-xl border p-3 transition-colors sm:p-4 ${
        isDragOver
          ? 'border-brand-400 bg-brand-50'
          : 'border-slate-200 bg-slate-50'
      }`}
      onDragLeave={() => setIsDragOver(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`size-2 rounded-full ${completed ? 'bg-emerald-500' : 'bg-brand-500'}`}
          />
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
          {todos.length}
        </span>
      </div>

      <div className="space-y-3">
        {todos.map((todo) => (
          <TodoCard
            isUpdating={isUpdating}
            key={todo.id}
            onStatusChange={onStatusChange}
            todo={todo}
          />
        ))}
        {todos.length === 0 ? (
          <div className="grid min-h-32 place-items-center rounded-lg border border-dashed border-slate-300 bg-white/60 p-4 text-center text-xs text-slate-500">
            Drop a todo here or use its status button.
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function TodoBoard({
  isUpdating = false,
  onStatusChange,
  todos,
}: TodoBoardProps) {
  const openTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-panel sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Current workflow
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Drag a card between lanes, or use Complete and Reopen for keyboard
            and touch access.
          </p>
        </div>
        <StatusBadge tone="info">{todos.length} work items</StatusBadge>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-2">
        <BoardColumn
          completed={false}
          isUpdating={isUpdating}
          onDropTodo={onStatusChange}
          onStatusChange={onStatusChange}
          todos={openTodos}
        />
        <BoardColumn
          completed
          isUpdating={isUpdating}
          onDropTodo={onStatusChange}
          onStatusChange={onStatusChange}
          todos={completedTodos}
        />
      </div>
    </section>
  )
}
