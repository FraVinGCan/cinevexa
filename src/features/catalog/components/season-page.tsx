import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { DetailSkeleton } from '@/components/feedback/detail-skeleton'
import { ErrorState } from '@/components/feedback/error-state'
import { AddressLabel } from '@/components/detail/address-label'
import { DetailPage } from '@/components/detail/detail-page'
import { DetailSection } from '@/components/detail/detail-section'
import { ExternalLinks } from '@/components/detail/external-links'
import { TitleFacts } from '@/components/detail/title-facts'
import { TitleNotFound } from '@/components/detail/title-not-found'
import { MediaGallery } from '@/components/gallery/media-gallery'
import { seasonStillsOf } from '@/components/gallery/gallery-items'
import { Button } from '@/components/ui/button'
import { RatingBadge } from '@/components/media/rating-badge'
import { detailTitleOf, externalLinksOf } from '../detail'
import { seasonOptions, tvDetailOptions } from '../tv'
import { usePreferencesStore } from '@/features/preferences/preferences.store'
import { formatDayMonthYear } from '@/lib/tmdb/format'
import { parseSeasonNumber, parseTmdbId } from '@/lib/tmdb/id'
import { isTmdbError } from '@/lib/tmdb/errors'
import type { EpisodeListItem } from '@/types/tmdb'

/**
 * A season is read through the series it belongs to, so both are fetched: TMDB
 * cannot return a season and its show in one request, and the header needs the
 * show's title, artwork, and fact list to say whose season this is.
 */
export function SeasonPage() {
  const { id: rawId, seasonNumber: rawSeason } = useParams()
  const id = parseTmdbId(rawId)
  const seasonNumber = parseSeasonNumber(rawSeason)
  const language = usePreferencesStore((state) => state.language)

  const showQuery = useQuery({
    ...tvDetailOptions(id ?? 0, language),
    enabled: id !== null,
  })
  const seasonQuery = useQuery({
    ...seasonOptions(id ?? 0, seasonNumber ?? 0, language),
    enabled: id !== null && seasonNumber !== null,
  })

  if (id === null || seasonNumber === null) {
    return (
      <DetailPage>
        <TitleNotFound
          subject={id === null ? 'series' : 'season'}
          action={{ label: 'Browse series', to: '/discover/tv' }}
        />
      </DetailPage>
    )
  }

  if (showQuery.isPending || seasonQuery.isPending) {
    return (
      <DetailPage>
        <DetailSkeleton address="this season" />
      </DetailPage>
    )
  }

  if (showQuery.isError) {
    if (isTmdbError(showQuery.error) && showQuery.error.kind === 'not-found') {
      return (
        <DetailPage>
          <TitleNotFound
            subject="series"
            action={{ label: 'Browse series', to: '/discover/tv' }}
          />
        </DetailPage>
      )
    }
    return (
      <DetailPage>
        <ErrorState
          error={showQuery.error}
          onRetry={() => showQuery.refetch()}
          action={{ label: 'Browse series', to: '/discover/tv' }}
        />
      </DetailPage>
    )
  }

  if (seasonQuery.isError) {
    if (
      isTmdbError(seasonQuery.error) &&
      seasonQuery.error.kind === 'not-found'
    ) {
      return (
        <DetailPage>
          <TitleNotFound
            subject="season"
            action={{ label: 'Browse series', to: '/discover/tv' }}
          />
        </DetailPage>
      )
    }
    return (
      <DetailPage>
        <ErrorState
          error={seasonQuery.error}
          onRetry={() => seasonQuery.refetch()}
          action={{ label: 'Browse series', to: '/discover/tv' }}
        />
      </DetailPage>
    )
  }

  const show = showQuery.data
  const season = seasonQuery.data
  const stills = seasonStillsOf(season.episodes)

  return (
    <DetailPage>
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link to={`/tv/${show.id}`} />}
        className="-ml-2 self-start">
        <ArrowLeftIcon />
        {show.name}
      </Button>

      <header className="flex flex-col gap-3">
        <AddressLabel>
          <Link
            to={`/tv/${show.id}`}
            className="underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
            {show.name}
          </Link>
        </AddressLabel>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {season.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {season.episodes.length}{' '}
            {season.episodes.length === 1 ? 'episode' : 'episodes'}
          </p>
          {formatDayMonthYear(season.air_date) !== null && (
            <p className="text-sm text-muted-foreground">
              from {formatDayMonthYear(season.air_date)}
            </p>
          )}
          {season.vote_average > 0 && (
            <RatingBadge value={season.vote_average} />
          )}
        </div>
        {season.overview !== '' && (
          <p className="max-w-[65ch] text-sm/relaxed text-pretty text-muted-foreground">
            {season.overview}
          </p>
        )}
      </header>

      <TitleFacts
        items={[
          {
            term: 'Networks',
            description:
              season.networks.length > 0
                ? season.networks.map((network) => network.name).join(', ')
                : null,
          },
          {
            term: 'Episodes',
            description: String(season.episodes.length),
          },
          {
            term: 'Series',
            description: detailTitleOf(show).title,
          },
        ]}
      />

      {season.episodes.length > 0 && (
        <DetailSection
          label="Episodes"
          heading={`${season.episodes.length} ${season.episodes.length === 1 ? 'episode' : 'episodes'}`}>
          <EpisodeList
            seasonNumber={season.season_number}
            episodes={season.episodes}
          />
        </DetailSection>
      )}

      {stills.length > 0 && (
        <DetailSection
          label="Stills"
          heading="Frames from this season"
          action={
            <p className="text-xs text-muted-foreground tabular-nums">
              {stills.length} {stills.length === 1 ? 'still' : 'stills'}
            </p>
          }>
          <MediaGallery
            title={`${season.name} stills`}
            images={stills}
            videos={[]}
            emptyLabel=""
          />
        </DetailSection>
      )}

      <ExternalLinksSection links={externalLinksOf(show, show.external_ids)} />
    </DetailPage>
  )
}

type EpisodeListProps = {
  seasonNumber: number
  episodes: EpisodeListItem[]
}

/**
 * Episodes read as a list of rows rather than a grid of cards: what a reader
 * wants from an episode index is the number, the title, the date, and the
 * rating, scanned down a column.
 */
function EpisodeList({ seasonNumber, episodes }: EpisodeListProps) {
  return (
    <ol className="flex flex-col divide-y divide-border overflow-hidden rounded-4xl bg-card shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10">
      {episodes.map((episode) => (
        <li key={episode.id} className="flex flex-col gap-1.5 p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-heading text-sm font-medium text-muted-foreground tabular-nums">
              S{String(seasonNumber).padStart(2, '0')}E
              {String(episode.episode_number).padStart(2, '0')}
            </span>
            <h3 className="font-heading text-base font-medium text-card-foreground">
              {episode.name}
            </h3>
            {episode.episode_type !== '' && (
              <span className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
                {episode.episode_type}
              </span>
            )}
            {episode.vote_average > 0 && (
              <span className="ml-auto">
                <RatingBadge value={episode.vote_average} />
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>
              {formatDayMonthYear(episode.air_date) ?? 'Air date unannounced'}
            </span>
            {episode.runtime !== null && episode.runtime > 0 && (
              <span>{episode.runtime} min</span>
            )}
            {episode.production_code !== '' && (
              <span className="tabular-nums">{episode.production_code}</span>
            )}
          </div>

          {episode.overview !== '' && (
            <p className="max-w-[70ch] text-sm/relaxed text-pretty text-muted-foreground">
              {episode.overview}
            </p>
          )}

          {episode.guest_stars.length > 0 && (
            <p className="text-xs text-muted-foreground">
              With{' '}
              {episode.guest_stars.slice(0, 6).map((star, index) => (
                <span key={star.credit_id}>
                  {index > 0 && ', '}
                  <Link
                    to={`/person/${star.id}`}
                    className="underline-offset-4 hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
                    {star.name}
                  </Link>
                </span>
              ))}
              {episode.guest_stars.length > 6 && (
                <span> and {episode.guest_stars.length - 6} more</span>
              )}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}

function ExternalLinksSection({
  links,
}: {
  links: ReturnType<typeof externalLinksOf>
}) {
  if (links.length === 0) return null
  return (
    <DetailSection label="Elsewhere" heading="Other pages for this series">
      <ExternalLinks links={links} className="flex flex-wrap gap-x-6 gap-y-1" />
    </DetailSection>
  )
}
