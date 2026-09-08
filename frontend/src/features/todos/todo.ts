import type {
  TodoCreate,
  TodoOut,
  TodoUpdate,
} from 'todo-api-client'

export type Todo = TodoOut
export type TodoDraft = TodoCreate
export type { TodoCreate, TodoUpdate }
