import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AuthStatus =
  'anonymous' | 'authenticating' | 'authenticated' | 'error'

export type AuthSession = {
  v4AccessToken: string | null
  sessionId: string
  accountId: number
  accountObjectId: string | null
  username: string
  avatarPath: string | null
}

type AuthState = {
  v4AccessToken: string | null
  sessionId: string | null
  accountId: number | null
  accountObjectId: string | null
  username: string | null
  avatarPath: string | null
  status: AuthStatus
  setSession: (session: AuthSession) => void
  setStatus: (status: AuthStatus) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      v4AccessToken: null,
      sessionId: null,
      accountId: null,
      accountObjectId: null,
      username: null,
      avatarPath: null,
      status: 'anonymous',
      setSession: (session) =>
        set({
          v4AccessToken: session.v4AccessToken,
          sessionId: session.sessionId,
          accountId: session.accountId,
          accountObjectId: session.accountObjectId,
          username: session.username,
          avatarPath: session.avatarPath,
          status: 'authenticated',
        }),
      setStatus: (status) => set({ status }),
      clearSession: () =>
        set({
          v4AccessToken: null,
          sessionId: null,
          accountId: null,
          accountObjectId: null,
          username: null,
          avatarPath: null,
          status: 'anonymous',
        }),
    }),
    {
      name: 'cinevexa-auth',
      partialize: ({
        v4AccessToken,
        sessionId,
        accountId,
        accountObjectId,
        username,
        avatarPath,
        status,
      }) => ({
        v4AccessToken,
        sessionId,
        accountId,
        accountObjectId,
        username,
        avatarPath,
        status,
      }),
    },
  ),
)

export function getSessionId(): string | null {
  return useAuthStore.getState().sessionId
}

export function isAuthenticated(): boolean {
  const { sessionId, status } = useAuthStore.getState()
  return sessionId !== null && status === 'authenticated'
}
