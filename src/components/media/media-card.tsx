import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from 'cn'
import { MediaPoster } from './media-poster'
import { RatingBadge } from './rating-badge'
import { posterDimensions, posterUrl } from '@/lib/tmdb/image'
import {
  hasScore,
  mediaTypeOf,
  titleOf,
  titlePath,
  yearOf,
} from '@/lib/tmdb/format'
import type { TitleListItem } from '@/types/tmdb'

type MediaCardProps = {
  item: TitleListItem
  className?: string
  trailing?: ReactNode
}

export function MediaCard({ item, className, trailing }: MediaCardProps) {
  const year = yearOf(item)
  const scored = hasScore(item)

  return (
    <Link
      to={titlePath(item, mediaTypeOf(item))}
      className={cn(
        'group/media-card flex items-center gap-4 rounded-4xl bg-card p-3 shadow-md ring-1 ring-foreground/5 transition-colors hover:bg-surface-raised focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none dark:ring-foreground/10',
        className,
      )}>
      <MediaPoster
        src={posterUrl(item.poster_path, 'thumb')}
        {...posterDimensions.thumb}
        className="aspect-2/3 w-14 shrink-0 rounded-xl"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="line-clamp-2 font-heading text-sm leading-snug font-medium text-card-foreground">
          {titleOf(item)}
        </h3>
        <p className="text-xs text-muted-foreground">{year ?? 'Undated'}</p>
      </div>
      {scored && (
        <div className="flex shrink-0 items-center gap-2">
          <RatingBadge value={item.vote_average} voteCount={item.vote_count} />
        </div>
      )}
      {trailing}
    </Link>
  )
}
