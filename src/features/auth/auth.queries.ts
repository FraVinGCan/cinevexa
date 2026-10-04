import { queryOptions } from '@tanstack/react-query'
import { getAccount } from './auth.api'

export const accountQueryOptions = (sessionId: string) =>
  queryOptions({
    queryKey: ['account', 'details', sessionId],
    queryFn: () => getAccount(sessionId),
    staleTime: 5 * 60 * 1000,
  })
