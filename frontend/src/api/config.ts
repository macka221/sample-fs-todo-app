export type ApiMode = 'direct' | 'proxy'

function readApiMode(value: string | undefined): ApiMode {
  const mode = value?.trim() || 'proxy'

  if (mode === 'proxy' || mode === 'direct') {
    return mode
  }

  throw new Error(
    `Unsupported VITE_API_MODE "${mode}". Use "proxy" or "direct".`,
  )
}

function readApiOrigin(mode: ApiMode, value: string | undefined) {
  if (mode === 'proxy') {
    return ''
  }

  const configuredOrigin = value?.trim()
  if (!configuredOrigin) {
    throw new Error('VITE_API_ORIGIN is required when VITE_API_MODE=direct')
  }

  const url = new URL(configuredOrigin)
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('VITE_API_ORIGIN must use http or https')
  }

  if (
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error(
      'VITE_API_ORIGIN must contain only an origin, for example http://localhost:8000',
    )
  }

  return url.origin
}

const mode = readApiMode(import.meta.env.VITE_API_MODE)

export const apiConfig = Object.freeze({
  mode,
  basePath: readApiOrigin(mode, import.meta.env.VITE_API_ORIGIN),
})
