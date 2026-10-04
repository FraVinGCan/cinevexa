import {
  deleteSession,
  requestV4Token,
  revokeV4AccessToken,
} from './auth.api'
import { useAuthStore } from './auth.store'
import { toast } from '@/components/ui/toast-manager'

const RETURN_TO_KEY = 'cinevexa-auth-return-to'
const REQUEST_TOKEN_KEY = 'cinevexa-auth-request-token'

export function rememberAuthDestination(destination: string): void {
  sessionStorage.setItem(RETURN_TO_KEY, destination)
}

export function takeAuthDestination(): string {
  const destination = sessionStorage.getItem(RETURN_TO_KEY) ?? '/account'
  sessionStorage.removeItem(RETURN_TO_KEY)
  return destination.startsWith('/') && !destination.startsWith('//')
    ? destination
    : '/account'
}

export function getAuthRequestToken(queryToken: string | null): string | null {
  return queryToken ?? sessionStorage.getItem(REQUEST_TOKEN_KEY)
}

export function clearAuthRequestToken(): void {
  sessionStorage.removeItem(REQUEST_TOKEN_KEY)
}

export async function beginSignIn(destination = '/account'): Promise<void> {
  rememberAuthDestination(destination)
  useAuthStore.getState().setStatus('authenticating')
  try {
    const callback = `${window.location.origin}/auth/callback`
    const response = await requestV4Token(callback)
    sessionStorage.setItem(REQUEST_TOKEN_KEY, response.request_token)
    window.location.assign(
      `https://www.themoviedb.org/auth/access?request_token=${encodeURIComponent(response.request_token)}`,
    )
  } catch (error) {
    useAuthStore.getState().setStatus('error')
    toast.add({
      title: 'Could not connect TMDB',
      description:
        error instanceof Error
          ? error.message
          : 'TMDB did not issue a request token. Try again.',
      type: 'error',
    })
  }
}

export async function signOut(): Promise<void> {
  const { sessionId, v4AccessToken, clearSession } = useAuthStore.getState()
  try {
    if (sessionId) await deleteSession(sessionId)
  } finally {
    try {
      if (v4AccessToken) await revokeV4AccessToken(v4AccessToken)
    } finally {
      clearSession()
    }
  }
}
