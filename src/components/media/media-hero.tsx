import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from 'cn'
import { MediaPoster } from './media-poster'
import { RatingBadge } from './rating-badge'
import { Button } from '@/components/ui/button'
import { backdropDimensions, backdropUrl } from '@/lib/tmdb/image'
import {
  hasScore,
  languageLabel,
  mediaTypeOf,
  releaseLineOf,
  titleOf,
  titlePath,
} from '@/lib/tmdb/format'
import type { TitleListItem } from '@/types/tmdb'

type MediaHeroProps = {
  label: string
  item: TitleListItem
  actionLabel?: string
  children?: ReactNode
  className?: string
}

export function MediaHero({
  label,
  item,
  actionLabel = 'Open title',
  children,
  className,
}: MediaHeroProps) {
  const to = titlePath(item, mediaTypeOf(item))
  const releaseLine = releaseLineOf(item)
  const language = languageLabel(item.original_language)
  const caption = [releaseLine, language].filter(Boolean).join(' · ')

  return (
    <article
      className={cn(
        'overflow-hidden rounded-4xl bg-card shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10',
        className,
      )}>
      <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <MediaPoster
          src={backdropUrl(item.backdrop_path, 'hero')}
          {...backdropDimensions.hero}
          priority
          className="aspect-16/9 md:aspect-auto md:h-full"
        />
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <p className="flex items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            {label}
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            <Link
              to={to}
              className="rounded-sm hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
              {titleOf(item)}
            </Link>
          </h1>
          <div className="flex flex-col items-start gap-1.5">
            {hasScore(item) && (
              <RatingBadge
                value={item.vote_average}
                voteCount={item.vote_count}
              />
            )}
            {caption && (
              <p className="text-xs text-muted-foreground">{caption}</p>
            )}
          </div>
          {item.overview && (
            <p className="line-clamp-3 text-sm/relaxed text-muted-foreground">
              {item.overview}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
            <Button
              nativeButton={false}
              size="lg"
              className="h-11"
              render={<Link to={to} />}>
              {actionLabel}
            </Button>
            {children}
          </div>
        </div>
      </div>
    </article>
  )
}
