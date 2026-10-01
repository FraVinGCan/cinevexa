export type TmdbErrorKind =
  | 'api-key'
  | 'authentication'
  | 'rate-limit'
  | 'not-found'
  | 'parameters'
  | 'server'
  | 'network'
  | 'unknown'

const STATUS_CODE_COPY: Record<
  number,
  { kind: TmdbErrorKind; message: string }
> = {
  3: {
    kind: 'authentication',
    message:
      'TMDB rejected this session. Connect your TMDB account again to continue.',
  },
  7: {
    kind: 'api-key',
    message:
      'This deployment is missing a valid TMDB API key, so no catalogue data can load.',
  },
  34: {
    kind: 'not-found',
    message:
      'TMDB has no record of this title. It may have been removed or renamed.',
  },
  36: {
    kind: 'parameters',
    message: 'TMDB rejected these filters. Clear the filters and try again.',
  },
}

const HTTP_STATUS_COPY: Record<
  number,
  { kind: TmdbErrorKind; message: string }
> = {
  400: { kind: 'parameters', message: 'TMDB rejected this request.' },
  401: {
    kind: 'authentication',
    message:
      'Your TMDB session is no longer valid. Connect your account again to continue.',
  },
  403: {
    kind: 'authentication',
    message: 'TMDB refused this request for your session.',
  },
  404: {
    kind: 'not-found',
    message:
      'TMDB has no record of this title. It may have been private or removed.',
  },
  429: {
    kind: 'rate-limit',
    message: 'TMDB is rate limiting this browser. Wait a moment, then retry.',
  },
  500: {
    kind: 'server',
    message: 'TMDB is having trouble right now. Retry in a moment.',
  },
  503: {
    kind: 'server',
    message: 'TMDB is unavailable right now. Retry in a moment.',
  },
}

const DEFAULT_HTTP_COPY: Record<TmdbErrorKind, string> = {
  'api-key': 'This deployment is missing a valid TMDB API key.',
  authentication: 'TMDB refused this request.',
  'rate-limit':
    'TMDB is rate limiting this browser. Wait a moment, then retry.',
  'not-found': 'TMDB has no record of this title.',
  parameters: 'TMDB rejected this request.',
  server: 'TMDB is having trouble right now. Retry in a moment.',
  network: 'Could not reach TMDB. Check your connection and retry.',
  unknown: 'This request did not complete as expected. Retry in a moment.',
}

const RETRYABLE_KINDS: readonly TmdbErrorKind[] = [
  'server',
  'network',
  'rate-limit',
  'unknown',
]

export class TmdbError extends Error {
  readonly kind: TmdbErrorKind
  readonly status: number
  readonly statusCode: number | null
  readonly statusMessage: string | null
  readonly endpoint: string | null

  constructor(init: {
    message: string
    kind: TmdbErrorKind
    status?: number
    statusCode?: number | null
    statusMessage?: string | null
    endpoint?: string | null
    cause?: unknown
  }) {
    super(init.message, { cause: init.cause })
    this.name = 'TmdbError'
    this.kind = init.kind
    this.status = init.status ?? 0
    this.statusCode = init.statusCode ?? null
    this.statusMessage = init.statusMessage ?? null
    this.endpoint = init.endpoint ?? null
  }
}

export function isTmdbError(error: unknown): error is TmdbError {
  return error instanceof TmdbError
}

export function kindFromStatus(status: number): TmdbErrorKind {
  const httpCopy = HTTP_STATUS_COPY[status]
  if (httpCopy) return httpCopy.kind
  if (status >= 500) return 'server'
  if (status >= 400) return 'parameters'
  return 'unknown'
}

export function fromTmdbFailure(init: {
  status: number
  statusCode?: number | null
  statusMessage?: string | null
  endpoint: string
}): TmdbError {
  const { status, statusCode, statusMessage, endpoint } = init
  const codeCopy =
    statusCode === null || statusCode === undefined
      ? undefined
      : STATUS_CODE_COPY[statusCode]
  const httpCopy = HTTP_STATUS_COPY[status]
  const kind = codeCopy?.kind ?? httpCopy?.kind ?? kindFromStatus(status)
  const message =
    codeCopy?.message ??
    httpCopy?.message ??
    statusMessage ??
    DEFAULT_HTTP_COPY[kind]
  return new TmdbError({
    message,
    kind,
    status,
    statusCode: statusCode ?? null,
    statusMessage: statusMessage ?? null,
    endpoint,
  })
}

export function fromNetworkFailure(
  cause: unknown,
  endpoint: string,
): TmdbError {
  return new TmdbError({
    message: DEFAULT_HTTP_COPY.network,
    kind: 'network',
    endpoint,
    cause,
  })
}

export function describeError(error: unknown): {
  title: string
  message: string
} {
  if (!isTmdbError(error)) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        title: 'Request cancelled',
        message: 'The request was cancelled before it finished.',
      }
    }
    return { title: 'Something went wrong', message: DEFAULT_HTTP_COPY.unknown }
  }
  const titles: Record<TmdbErrorKind, string> = {
    'api-key': 'Configuration problem',
    authentication: 'TMDB session problem',
    'rate-limit': 'TMDB is rate limiting',
    'not-found': 'Not in the index',
    parameters: 'Filters rejected',
    server: 'TMDB is unavailable',
    network: 'No connection to TMDB',
    unknown: 'Something went wrong',
  }
  return { title: titles[error.kind], message: error.message }
}

export function isRetryableError(error: unknown): boolean {
  if (!isTmdbError(error)) return false
  return RETRYABLE_KINDS.includes(error.kind)
}
