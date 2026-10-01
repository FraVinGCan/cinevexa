import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AuthStatus =
  'anonymous' | 'authenticating' | 'authenticated' | 'error'

export type AuthSession = {
  sessionId: string
  accountId: number
  accountObjectId: string | null
  username: string
  avatarPath: string | null
}

type AuthState = {
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
      sessionId: null,
      accountId: null,
      accountObjectId: null,
      username: null,
      avatarPath: null,
      status: 'anonymous',
      setSession: (session) =>
        set({
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
        sessionId,
        accountId,
        accountObjectId,
        username,
        avatarPath,
        status,
      }) => ({
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
