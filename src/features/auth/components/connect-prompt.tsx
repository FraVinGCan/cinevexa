import { Link } from 'react-router'
import { LogInIcon } from 'lucide-react'
import { beginSignIn } from '../auth.actions'
import { EmptyState } from '@/components/feedback/empty-state'
import { Button } from '@/components/ui/button'

export function ConnectPrompt({ destination }: { destination: string }) {
  return (
    <EmptyState
      icon={LogInIcon}
      title="Connect your TMDB account"
      description="Sign in with TMDB to unlock your personal library. Your account stays with TMDB; Cinevexa only keeps the session in this browser."
      className="mx-auto max-w-xl">
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => void beginSignIn(destination)}>
          <LogInIcon />
          Connect TMDB
        </Button>
        <Button nativeButton={false} variant="ghost" render={<Link to="/" />}>
          Keep browsing
        </Button>
      </div>
    </EmptyState>
  )
}
