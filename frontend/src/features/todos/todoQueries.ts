import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createAuthenticatedApi } from '../../api/client.ts'
import { useAuth } from '../../auth/authContextValue.ts'
import { getFirebaseIdToken } from '../../auth/firebaseClient.ts'
import type { Todo, TodoDraft, TodoUpdate } from './todo.ts'

const authenticatedApi = createAuthenticatedApi(getFirebaseIdToken)

export const todoQueryKeys = {
  detail: (userId: string, todoId: number) =>
    ['todos', userId, todoId] as const,
  list: (userId: string) => ['todos', userId] as const,
}

function useAuthenticatedUserId() {
  const { user } = useAuth()

  if (!user) {
    throw new Error('Todo hooks require an authenticated user.')
  }

  return user.id
}

export function useTodosQuery() {
  const userId = useAuthenticatedUserId()

  return useQuery({
    queryKey: todoQueryKeys.list(userId),
    queryFn: ({ signal }) => authenticatedApi.todos.list(signal),
  })
}

export function useTodoQuery(todoId: number | null) {
  const userId = useAuthenticatedUserId()

  return useQuery({
    enabled: todoId !== null,
    queryKey: ['todos', userId, todoId] as const,
    queryFn: ({ signal }) => {
      if (todoId === null) {
        throw new Error('A valid Todo ID is required.')
      }

      return authenticatedApi.todos.get(todoId, signal)
    },
  })
}

export function useCreateTodoMutation() {
  const userId = useAuthenticatedUserId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (draft: TodoDraft) => authenticatedApi.todos.create(draft),
    onSuccess: (createdTodo) => {
      queryClient.setQueryData<Todo[]>(
        todoQueryKeys.list(userId),
        (currentTodos = []) => [...currentTodos, createdTodo],
      )
      void queryClient.invalidateQueries({
        queryKey: todoQueryKeys.list(userId),
      })
    },
  })
}

interface UpdateTodoVariables {
  input: TodoUpdate
  todoId: number
}

export function useUpdateTodoMutation() {
  const userId = useAuthenticatedUserId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ input, todoId }: UpdateTodoVariables) =>
      authenticatedApi.todos.update(todoId, input),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData<Todo>(
        todoQueryKeys.detail(userId, updatedTodo.id),
        updatedTodo,
      )
      queryClient.setQueryData<Todo[]>(
        todoQueryKeys.list(userId),
        (currentTodos = []) =>
          currentTodos.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
      )
      void queryClient.invalidateQueries({
        queryKey: todoQueryKeys.list(userId),
      })
    },
  })
}

export function useDeleteTodoMutation() {
  const userId = useAuthenticatedUserId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (todoId: number) => authenticatedApi.todos.remove(todoId),
    onSuccess: (_, todoId) => {
      queryClient.setQueryData<Todo[]>(
        todoQueryKeys.list(userId),
        (currentTodos = []) =>
          currentTodos.filter((todo) => todo.id !== todoId),
      )
      queryClient.removeQueries({
        queryKey: todoQueryKeys.detail(userId, todoId),
      })
      void queryClient.invalidateQueries({
        queryKey: todoQueryKeys.list(userId),
      })
    },
  })
}
