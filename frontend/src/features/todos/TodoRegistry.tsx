import { useDeferredValue, useState } from 'react'
import { Link } from 'react-router'

import { StatusBadge } from '../../components/ui/StatusBadge.tsx'
import { TextField } from '../../components/ui/TextField.tsx'
import type { Todo } from './todo.ts'

type StatusFilter = 'all' | 'open' | 'completed'

interface TodoRegistryProps {
  todos: Todo[]
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function includesQuery(todo: Todo, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase()

  if (!normalizedQuery) {
    return true
  }

  return [todo.title, todo.description ?? ''].some((value) =>
    value.toLocaleLowerCase().includes(normalizedQuery),
  )
}

export function TodoRegistry({ todos }: TodoRegistryProps) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const deferredQuery = useDeferredValue(query)

  const visibleTodos = todos.filter((todo) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' ? todo.completed : !todo.completed)

    return matchesStatus && includesQuery(todo, deferredQuery)
  })

  return (
    <section
      className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-panel"
    >
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              All todos
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Search titles and descriptions, then narrow the list by status.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:max-w-2xl">
            <TextField
              aria-label="Search todos"
              label="Search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search todos..."
              type="search"
              value={query}
            />
            <div className="sm:w-44">
              <label
                className="mb-1.5 block text-xs font-semibold text-slate-700"
                htmlFor="status-filter"
              >
                Status
              </label>
              <select
                className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-xs outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
                id="status-filter"
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                value={statusFilter}
              >
                <option value="all">All statuses</option>
                <option value="open">Open</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500" role="status">
          Showing {visibleTodos.length} of {todos.length} todos
          {query !== deferredQuery ? ' · Updating results...' : ''}
        </p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase">
                Todo
              </th>
              <th className="px-6 py-3 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase">
                Created
              </th>
              <th className="px-6 py-3 text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-[0.6875rem] font-semibold tracking-wider text-slate-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleTodos.map((todo) => (
              <tr className="hover:bg-slate-50/80" key={todo.id}>
                <td className="max-w-xl px-6 py-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 font-mono text-[0.625rem] text-slate-400">
                      TD-{todo.id}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {todo.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {todo.description ?? 'No description'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge tone={todo.completed ? 'success' : 'info'}>
                    {todo.completed ? 'Completed' : 'Open'}
                  </StatusBadge>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                  {formatDate(todo.created_at)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                  {formatDate(todo.updated_at)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <Link
                    className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    to={`/todos/${todo.id}`}
                  >
                    View / edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden">
        {visibleTodos.map((todo) => (
          <li className="p-5" key={todo.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {todo.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {todo.description ?? 'No description'}
                </p>
              </div>
              <StatusBadge tone={todo.completed ? 'success' : 'info'}>
                {todo.completed ? 'Completed' : 'Open'}
              </StatusBadge>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-[0.6875rem] text-slate-400">
              <span className="font-mono">TD-{todo.id}</span>
              <Link
                className="font-semibold text-brand-700 hover:text-brand-800 hover:underline"
                to={`/todos/${todo.id}`}
              >
                View / edit
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {visibleTodos.length === 0 ? (
        <div className="border-t border-slate-100 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-slate-700">
            No matching todos
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try a different search term or status.
          </p>
        </div>
      ) : null}
    </section>
  )
}
