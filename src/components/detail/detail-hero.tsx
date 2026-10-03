import type { ReactNode } from 'react'
import { AddressLabel } from './address-label'
import { MediaPoster } from '@/components/media/media-poster'
import { RatingBadge } from '@/components/media/rating-badge'
import { backdropDimensions, backdropUrl } from '@/lib/tmdb/image'

type DetailHeroProps = {
  address: ReactNode
  title: string
  tagline: string | null
  backdropPath: string | null
  score: { value: number; count: number } | null
  caption: string | null
  overview: string | null
  children?: ReactNode
}

/**
 * The one title a route leads with, in the split cell the design system defines:
 * artwork on the left at 16:9, address and metadata on the right, never a
 * full-bleed backdrop behind the copy.
 */
export function DetailHero({
  address,
  title,
  tagline,
  backdropPath,
  score,
  caption,
  overview,
  children,
}: DetailHeroProps) {
  return (
    <article className="overflow-hidden rounded-4xl bg-card shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10">
      <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <MediaPoster
          src={backdropUrl(backdropPath, 'hero')}
          {...backdropDimensions.hero}
          priority
          className="aspect-16/9 md:aspect-auto md:h-full"
        />
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <AddressLabel>{address}</AddressLabel>
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {title}
            </h1>
            {tagline !== null && (
              <p className="text-sm text-pretty text-muted-foreground">
                {tagline}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {score !== null && (
                <RatingBadge value={score.value} voteCount={score.count} />
              )}
              {caption !== null && (
                <p className="text-xs text-muted-foreground">{caption}</p>
              )}
            </div>
            {children}
          </div>
          {overview !== null && (
            <p className="max-w-[65ch] text-sm/relaxed text-pretty text-muted-foreground">
              {overview}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
