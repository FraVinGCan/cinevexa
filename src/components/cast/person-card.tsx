import { Link } from 'react-router'
import { cn } from 'cn'
import { MediaPoster } from '@/components/media/media-poster'
import { profileDimensions, profileUrl } from '@/lib/tmdb/image'

type PersonCardProps = {
  id: number
  name: string
  profilePath: string | null
  /** The role beside the name: a character for cast, a job for crew. */
  role?: string | null
  className?: string
}

/**
 * A person as a cell: portrait above, name and role below, in the same shape as a
 * poster cell so a cast wall reads at the same density as a title wall.
 */
export function PersonCard({
  id,
  name,
  profilePath,
  role,
  className,
}: PersonCardProps) {
  return (
    <Link
      to={`/person/${id}`}
      className={cn(
        'group/person-card flex flex-col overflow-hidden rounded-4xl bg-card p-2 shadow-md ring-1 ring-foreground/5 transition-colors hover:bg-surface-raised focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none dark:ring-foreground/10',
        className,
      )}>
      <MediaPoster
        src={profileUrl(profilePath, 'list')}
        {...profileDimensions.list}
        className="aspect-2/3 w-full shrink-0"
      />
      <div className="flex flex-1 flex-col gap-0.5 px-1 pt-2 pb-1">
        <p className="line-clamp-2 min-h-[2.25rem] text-sm leading-snug font-medium text-card-foreground">
          {name}
        </p>
        {role !== undefined && role !== null && role !== '' && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{role}</p>
        )}
      </div>
    </Link>
  )
}
