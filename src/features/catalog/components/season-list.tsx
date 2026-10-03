import { Link } from 'react-router'
import { MediaPoster } from '@/components/media/media-poster'
import { RatingBadge } from '@/components/media/rating-badge'
import { seasonLabel } from '../detail'
import { formatDayMonthYear } from '@/lib/tmdb/format'
import { posterDimensions, posterUrl } from '@/lib/tmdb/image'
import type { SeasonSummary } from '@/types/tmdb'

type SeasonListProps = {
  showId: number
  seasons: SeasonSummary[]
}

/**
 * A rail of season posters rather than a list of names: a reader choosing between
 * seasons is looking for the artwork they recognise. Season 0 is included and
 * named as it comes, because specials are a season TMDB numbers but readers do not.
 */
export function SeasonList({ showId, seasons }: SeasonListProps) {
  if (seasons.length === 0) return null

  return (
    <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain contain-paint pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/35">
      {seasons.map((season) => (
        <li key={season.id} className="w-36 shrink-0 snap-start sm:w-40">
          <Link
            to={`/tv/${showId}/season/${season.season_number}`}
            className="group/season flex flex-col overflow-hidden rounded-4xl bg-card p-2 shadow-md ring-1 ring-foreground/5 transition-colors hover:bg-surface-raised focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none dark:ring-foreground/10">
            <MediaPoster
              src={posterUrl(season.poster_path, 'grid')}
              {...posterDimensions.grid}
              className="aspect-2/3 w-full shrink-0"
            />
            <div className="flex flex-1 flex-col gap-1 px-1 pt-2 pb-1">
              <h3 className="line-clamp-2 text-sm leading-snug font-medium text-card-foreground">
                {seasonLabel(season)}
              </h3>
              <p className="text-xs text-muted-foreground">
                {season.episode_count}{' '}
                {season.episode_count === 1 ? 'episode' : 'episodes'}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDayMonthYear(season.air_date) ?? 'Undated'}
              </p>
              {season.vote_average > 0 && (
                <div className="mt-auto pt-1.5">
                  <RatingBadge value={season.vote_average} />
                </div>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
