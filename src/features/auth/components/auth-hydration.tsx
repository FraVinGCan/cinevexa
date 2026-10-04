import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { accountQueryOptions } from '../auth.queries'
import { useAuthStore } from '../auth.store'

export function AuthHydration() {
  const sessionId = useAuthStore((state) => state.sessionId)
  const v4AccessToken = useAuthStore((state) => state.v4AccessToken)
  const status = useAuthStore((state) => state.status)
  const setSession = useAuthStore((state) => state.setSession)
  const accountQuery = useQuery({
    ...accountQueryOptions(sessionId ?? ''),
    enabled: status === 'authenticated' && sessionId !== null,
  })

  useEffect(() => {
    if (!accountQuery.data || !sessionId) return
    setSession({
      v4AccessToken,
      sessionId,
      accountId: accountQuery.data.id,
      accountObjectId: accountQuery.data.object_id ?? null,
      username: accountQuery.data.username,
      avatarPath: accountQuery.data.avatar?.tmdb.avatar_path ?? null,
    })
  }, [accountQuery.data, sessionId, setSession, v4AccessToken])

  return null
}
