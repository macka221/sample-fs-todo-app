import { isAxiosError } from 'axios'

interface ValidationDetail {
  msg?: unknown
}

interface ErrorPayload {
  detail?: unknown
}

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ApiError'
    this.status = status
  }
}

function readDetailMessage(payload: unknown) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined
  }

  const detail = (payload as ErrorPayload).detail
  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item: ValidationDetail) => item.msg)
      .filter((message): message is string => typeof message === 'string')

    return messages.length ? messages.join('. ') : undefined
  }

  return undefined
}

export function toApiError(error: unknown) {
  if (error instanceof ApiError) {
    return error
  }

  if (isAxiosError(error)) {
    const status = error.response?.status
    const message =
      readDetailMessage(error.response?.data) ??
      (error.response
        ? `The service returned status ${error.response.status}.`
        : 'The Todo service could not be reached.')

    return new ApiError(message, status, { cause: error })
  }

  if (error instanceof Error) {
    return new ApiError(error.message, undefined, { cause: error })
  }

  return new ApiError('An unexpected service error occurred.')
}
