import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from 'cn'
import { MediaPoster } from './media-poster'
import { RatingBadge } from './rating-badge'
import { posterDimensions, posterUrl, type PosterSize } from '@/lib/tmdb/image'
import {
  hasScore,
  mediaTypeOf,
  titleOf,
  titlePath,
  yearOf,
} from '@/lib/tmdb/format'
import type { TitleListItem } from '@/types/tmdb'

type PosterCardProps = {
  item: TitleListItem
  size?: PosterSize
  className?: string
  /** Read under the year: the part a person played, or the job they did. */
  trailing?: ReactNode
}

export function PosterCard({
  item,
  size = 'grid',
  className,
  trailing,
}: PosterCardProps) {
  const year = yearOf(item)
  const scored = hasScore(item)

  return (
    <Link
      to={titlePath(item, mediaTypeOf(item))}
      className={cn(
        'group/poster-card flex flex-col overflow-hidden rounded-4xl bg-card shadow-md ring-1 ring-foreground/5 transition-colors hover:bg-surface-raised focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none dark:ring-foreground/10',
        className,
      )}>
      <MediaPoster
        src={posterUrl(item.poster_path, size)}
        {...posterDimensions[size]}
        priority={size === 'detail'}
        className="aspect-2/3 w-full shrink-0"
      />
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 min-h-[2.75rem] font-heading text-base leading-snug font-medium text-card-foreground">
          {titleOf(item)}
        </h3>
        <div className="mt-auto flex flex-col items-start gap-1.5 pt-1">
          {scored && (
            <RatingBadge
              value={item.vote_average}
              voteCount={item.vote_count}
            />
          )}
          <p className="text-xs text-muted-foreground">{year ?? 'Undated'}</p>
          {trailing}
        </div>
      </div>
    </Link>
  )
}
