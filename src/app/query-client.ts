import { QueryClient } from '@tanstack/react-query'
import { isRetryableError, isTmdbError } from '@/lib/tmdb/errors'

const DEFAULT_STALE_TIME = 5 * 60 * 1000
const MAX_RETRIES = 2

function isTerminalError(error: unknown): boolean {
  if (!isTmdbError(error)) return false
  return !isRetryableError(error)
}

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (isTerminalError(error)) return false
  return failureCount < MAX_RETRIES
}

function retryDelay(retryAttempt: number, error: unknown): number {
  if (isTmdbError(error) && error.kind === 'rate-limit') return 5000
  return Math.min(1000 * 2 ** retryAttempt, 30000)
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME,
      gcTime: 10 * 60 * 1000,
      retry: shouldRetry,
      retryDelay,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: shouldRetry,
      retryDelay,
    },
  },
})
