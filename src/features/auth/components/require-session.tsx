import { useLocation } from 'react-router'
import { useAuthStore } from '../auth.store'
import { ConnectPrompt } from './connect-prompt'

export function RequireSession({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const status = useAuthStore((state) => state.status)
  const sessionId = useAuthStore((state) => state.sessionId)

  if (status !== 'authenticated' || !sessionId) {
    return (
      <ConnectPrompt destination={`${location.pathname}${location.search}`} />
    )
  }
  return children
}
