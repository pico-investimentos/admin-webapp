import { env } from '@/config/env'

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown> | null
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string = 'UNKNOWN_ERROR',
    readonly requestId?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function isSerializableBody(
  body: ApiRequestOptions['body'],
): body is Record<string, unknown> {
  return (
    Boolean(body) &&
    typeof body === 'object' &&
    !(body instanceof FormData) &&
    !(body instanceof Blob)
  )
}

const DEFAULT_TIMEOUT_MS = 10_000

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { signal: callerSignal, ...restOptions } = options
  const headers = new Headers(restOptions.headers)
  const body = isSerializableBody(restOptions.body)
    ? JSON.stringify(restOptions.body)
    : restOptions.body

  if (isSerializableBody(restOptions.body) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  const url = `${env.apiUrl}/${path.replace(/^\//, '')}`

  let response: Response
  try {
    response = await fetch(url, {
      ...restOptions,
      body,
      credentials: 'include',
      headers,
      signal: callerSignal ?? AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError(
        `A API não respondeu a tempo (${env.apiUrl}). Confira se a api/ está rodando.`,
        0,
        'NETWORK_TIMEOUT',
      )
    }

    throw new ApiError(
      `Não foi possível conectar à API em ${env.apiUrl}. Confira se ela está no ar.`,
      0,
      'NETWORK_ERROR',
    )
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: { code?: string; message?: string; requestId?: string }
    } | null

    throw new ApiError(
      payload?.error?.message ?? 'Não foi possível concluir a solicitação.',
      response.status,
      payload?.error?.code ?? 'UNKNOWN_ERROR',
      payload?.error?.requestId,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
