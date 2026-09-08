import type { AxiosResponse } from 'axios'
import {
  AuthApi,
  Configuration,
  MetaApi,
  TodosApi,
  type SignInResponse,
  type TodoCreate,
  type TodoOut,
  type TodoUpdate,
  type UserOut,
} from 'todo-api-client'

import { apiConfig } from './config.ts'
import { ApiError, toApiError } from './errors.ts'

export interface HealthStatus {
  status: 'ok'
}

export type AccessTokenProvider = () => Promise<string> | string

async function unwrap<T>(request: Promise<AxiosResponse<T>>) {
  try {
    return (await request).data
  } catch (error) {
    throw toApiError(error)
  }
}

const publicConfiguration = new Configuration({ basePath: apiConfig.basePath })
const publicAuthClient = new AuthApi(publicConfiguration)
const metaClient = new MetaApi(publicConfiguration)

export const healthApi = {
  async check(signal?: AbortSignal): Promise<HealthStatus> {
    const payload = await unwrap(metaClient.healthHealthGet({ signal }))

    if (
      typeof payload !== 'object' ||
      payload === null ||
      payload.status !== 'ok'
    ) {
      throw new ApiError('The service returned an invalid health response.')
    }

    return { status: 'ok' }
  },
}

export const authApi = {
  async signIn(idToken: string): Promise<SignInResponse> {
    return unwrap(
      publicAuthClient.signinApiV1AuthSigninPost({ id_token: idToken }),
    )
  },
}

export function createAuthenticatedApi(accessToken: AccessTokenProvider) {
  const configuration = new Configuration({
    accessToken: async () => accessToken(),
    basePath: apiConfig.basePath,
  })
  const authClient = new AuthApi(configuration)
  const todosClient = new TodosApi(configuration)

  return {
    user: {
      current(signal?: AbortSignal): Promise<UserOut> {
        return unwrap(
          authClient.readCurrentUserApiV1AuthUsersMeGet({ signal }),
        )
      },
    },
    todos: {
      list(signal?: AbortSignal): Promise<TodoOut[]> {
        return unwrap(todosClient.readAllTodosApiV1TodosGet({ signal }))
      },
      get(todoId: number, signal?: AbortSignal): Promise<TodoOut> {
        return unwrap(
          todosClient.readTodoApiV1TodosTodoIdGet(todoId, { signal }),
        )
      },
      create(input: TodoCreate): Promise<TodoOut> {
        return unwrap(todosClient.createNewTodoApiV1TodosPost(input))
      },
      update(todoId: number, input: TodoUpdate): Promise<TodoOut> {
        return unwrap(
          todosClient.updateExistingTodoApiV1TodosTodoIdPut(todoId, input),
        )
      },
      async remove(todoId: number): Promise<void> {
        await unwrap(
          todosClient.deleteExistingTodoApiV1TodosTodoIdDelete(todoId),
        )
      },
    },
  }
}
