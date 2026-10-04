import { buildParams, type TmdbParams } from './params'
import { TmdbError, fromNetworkFailure, fromTmdbFailure } from './errors'
import { useAuthStore } from '@/features/auth/auth.store'
import { getPreferences } from '@/features/preferences/preferences.store'

export const TMDB_V3_BASE_URL = 'https://api.themoviedb.org/3'
export const TMDB_V4_BASE_URL = 'https://api.themoviedb.org/4'

const apiKey = import.meta.env.VITE_TMDB_API_KEY?.trim()
const appReadAccessToken = import.meta.env.VITE_TMDB_API_READ_ACCESS_TOKEN?.trim()

export type TmdbRequestOptions = {
  params?: TmdbParams
  signal?: AbortSignal
  sessionId?: string | null
}

export type TmdbSendOptions = TmdbRequestOptions & {
  body: Record<string, unknown>
  baseUrl?: string
  bearerToken?: string | null
}

export function assertApiKey(): void {
  if (apiKey) return
  throw new TmdbError({
    message:
      'VITE_TMDB_API_KEY is not set. Copy .env.example to .env and add a TMDB v3 API key, then restart the dev server.',
    kind: 'api-key',
  })
}

function requestHeaders(): HeadersInit {
  return { Accept: 'application/json' }
}

async function readFailure(
  response: Response,
  endpoint: string,
): Promise<TmdbError> {
  let statusCode: number | null = null
  let statusMessage: string | null = null
  try {
    const payload: unknown = await response.json()
    if (typeof payload === 'object' && payload !== null) {
      const body = payload as {
        status_code?: unknown
        status_message?: unknown
      }
      if (typeof body.status_code === 'number') statusCode = body.status_code
      if (typeof body.status_message === 'string')
        statusMessage = body.status_message
    }
  } catch {
    statusCode = null
    statusMessage = null
  }
  return fromTmdbFailure({
    status: response.status,
    statusCode,
    statusMessage,
    endpoint,
  })
}

function handleUnauthorized(): void {
  const { sessionId, clearSession } = useAuthStore.getState()
  if (sessionId) clearSession()
}

async function request<T>(
  url: string,
  init: RequestInit,
  endpoint: string,
): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, init)
  } catch (cause) {
    if (init.signal?.aborted) throw cause
    throw fromNetworkFailure(cause, endpoint)
  }
  if (!response.ok) {
    const error = await readFailure(response, endpoint)
    if (response.status === 401) handleUnauthorized()
    throw error
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export async function tmdbGet<T>(
  path: string,
  options: TmdbRequestOptions = {},
): Promise<T> {
  assertApiKey()
  const { language, region } = getPreferences()
  const search = buildParams({
    api_key: apiKey,
    language,
    region,
    session_id: options.sessionId,
    ...options.params,
  })
  return request<T>(
    `${TMDB_V3_BASE_URL}${path}?${search.toString()}`,
    {
      method: 'GET',
      headers: requestHeaders(),
      signal: options.signal ?? null,
    },
    path,
  )
}

export async function tmdbSend<T>(
  path: string,
  options: TmdbSendOptions,
): Promise<T> {
  if (!options.bearerToken) assertApiKey()
  const sessionId = useAuthStore.getState().sessionId
  const search = buildParams({ api_key: apiKey, session_id: sessionId })
  const baseUrl = options.baseUrl ?? TMDB_V3_BASE_URL
  return request<T>(
    `${baseUrl}${path}?${search.toString()}`,
    {
      method: 'POST',
      headers: {
        ...requestHeaders(),
        ...(options.bearerToken
          ? { Authorization: `Bearer ${options.bearerToken}` }
          : {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options.body),
      signal: options.signal ?? null,
    },
    path,
  )
}

export function hasTmdbV4AppToken(): boolean {
  return Boolean(appReadAccessToken)
}

function requireV4AppToken(): string {
  if (!appReadAccessToken) {
    throw new TmdbError({
      message: 'VITE_TMDB_API_READ_ACCESS_TOKEN is not set.',
      kind: 'api-key',
    })
  }
  return appReadAccessToken
}

export function tmdbV4Send<T>(
  path: string,
  options: Pick<TmdbSendOptions, 'body' | 'signal' | 'bearerToken'> = { body: {} },
): Promise<T> {
  const token = options.bearerToken ?? requireV4AppToken()
  return request<T>(
    `${TMDB_V4_BASE_URL}${path}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options.body),
      signal: options.signal ?? null,
    },
    path,
  )
}

export function tmdbV4Delete<T>(
  path: string,
  options: { body: Record<string, unknown>; bearerToken: string; signal?: AbortSignal },
): Promise<T> {
  return request<T>(
    `${TMDB_V4_BASE_URL}${path}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${options.bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options.body),
      signal: options.signal ?? null,
    },
    path,
  )
}

export function tmdbDelete<T>(
  path: string,
  options: TmdbRequestOptions = {},
): Promise<T> {
  assertApiKey()
  const sessionId = useAuthStore.getState().sessionId
  const search = buildParams({
    api_key: apiKey,
    session_id: sessionId,
    ...options.params,
  })
  return request<T>(
    `${TMDB_V3_BASE_URL}${path}?${search.toString()}`,
    {
      method: 'DELETE',
      headers: requestHeaders(),
      signal: options.signal ?? null,
    },
    path,
  )
}
