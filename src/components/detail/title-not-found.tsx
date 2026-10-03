import { SearchXIcon } from 'lucide-react'
import { Link } from 'react-router'
import { EmptyState } from '@/components/feedback/empty-state'
import { Button } from '@/components/ui/button'
import { cn } from 'cn'

type TitleNotFoundProps = {
  subject: string
  className?: string
  action?: { label: string; to: string }
}

/**
 * Shown in place of a cell when TMDB has no such id, or when a route carries
 * something that cannot be an id. It is a state of the page rather than a thrown
 * error, so the reader keeps the app frame and a way onward.
 */
export function TitleNotFound({
  subject,
  className,
  action = { label: 'Browse movies', to: '/discover/movies' },
}: TitleNotFoundProps) {
  return (
    <EmptyState
      icon={SearchXIcon}
      className={cn('min-h-[40dvh]', className)}
      title={`No ${subject} matches this link`}
      description="The link may be mistyped, or TMDB may have removed the record. Everything here is read live from TMDB, so there is no local copy to fall back on.">
      <Button
        nativeButton={false}
        variant="outline"
        render={<Link to={action.to} />}>
        {action.label}
      </Button>
    </EmptyState>
  )
}
