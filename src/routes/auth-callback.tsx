import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { LoaderCircleIcon } from 'lucide-react'
import { EmptyState } from '@/components/feedback/empty-state'
import { Button } from '@/components/ui/button'
import {
  convertV4Session,
  createV4AccessToken,
  getAccount,
} from '@/features/auth/auth.api'
import { hasTmdbV4AppToken } from '@/lib/tmdb/client'
import {
  clearAuthRequestToken,
  takeAuthDestination,
  getAuthRequestToken,
} from '@/features/auth/auth.actions'
import { useAuthStore } from '@/features/auth/auth.store'

export function Component() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setSession = useAuthStore((state) => state.setSession)
  const [error, setError] = useState<string | null>(null)
  const queryRequestToken = searchParams.get('request_token')
  const requestToken = getAuthRequestToken(queryRequestToken)
  // V4 redirects are not required to include an `approved` query parameter.
  // The access-token exchange is the authoritative approval check.
  const approved = Boolean(requestToken)
  const callbackError =
    !hasTmdbV4AppToken()
      ? 'TMDB v4 authentication is not configured for this app.'
      : !requestToken || !approved
        ? 'TMDB did not approve the connection.'
        : null

  useEffect(() => {
    let active = true
    clearAuthRequestToken()
    if (!hasTmdbV4AppToken() || !requestToken || !approved) {
      useAuthStore.getState().setStatus('error')
      return () => {
        active = false
      }
    }

    useAuthStore.getState().setStatus('authenticating')
    const complete = async () => {
      const v4AccessToken = (await createV4AccessToken(requestToken)).access_token
      const session = await convertV4Session(v4AccessToken)
      const account = await getAccount(session.session_id)
      return { account, session, v4AccessToken }
    }
    void complete()
      .then(({ session, account, v4AccessToken }) => {
        if (!active) return
        setSession({
          v4AccessToken,
          sessionId: session.session_id,
          accountId: account.id,
          accountObjectId: account.object_id ?? null,
          username: account.username,
          avatarPath: account.avatar?.tmdb.avatar_path ?? null,
        })
        void navigate(takeAuthDestination(), { replace: true })
      })
      .catch((reason: unknown) => {
        if (!active) return
        useAuthStore.getState().setStatus('error')
        setError(reason instanceof Error ? reason.message : 'TMDB rejected the connection.')
      })

    return () => {
      active = false
    }
  }, [approved, navigate, requestToken, setSession])

  if (error || callbackError) {
    return (
      <EmptyState
        title="Could not connect TMDB"
        description={error ?? callbackError ?? 'The connection was not approved.'}>
        <Button onClick={() => void navigate('/account', { replace: true })}>
          Return to my library
        </Button>
      </EmptyState>
    )
  }

  return (
    <EmptyState
      icon={LoaderCircleIcon}
      title="Connecting your TMDB account…"
      description="Confirming the session and loading your account details."
    />
  )
}
