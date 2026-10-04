import { LibraryBigIcon } from 'lucide-react'
import { EmptyState } from '@/components/feedback/empty-state'
import { RequireSession } from '@/features/auth/components/require-session'

export function Component() {
  return (
    <RequireSession>
      <EmptyState
        icon={LibraryBigIcon}
        title="Your library is connected"
        description="Your watchlist, favourites, and ratings will appear here in the next library release."
        className="mx-auto max-w-xl">
        <p className="text-sm text-muted-foreground">Connected to TMDB.</p>
      </EmptyState>
    </RequireSession>
  )
}
