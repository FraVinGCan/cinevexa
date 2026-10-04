import { ListVideoIcon } from 'lucide-react'
import { EmptyState } from '@/components/feedback/empty-state'
import { RequireSession } from '@/features/auth/components/require-session'

export function Component() {
  return (
    <RequireSession>
      <EmptyState
        icon={ListVideoIcon}
        title="Your custom lists"
        description="Custom list management is part of the next account release."
        className="mx-auto max-w-xl"
      />
    </RequireSession>
  )
}
