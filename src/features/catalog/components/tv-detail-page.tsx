import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { ExternalLinkIcon, PlayIcon } from 'lucide-react'
import { DetailSkeleton } from '@/components/feedback/detail-skeleton'
import { ErrorState } from '@/components/feedback/error-state'
import { DetailHero } from '@/components/detail/detail-hero'
import { DetailPage } from '@/components/detail/detail-page'
import { DetailSection } from '@/components/detail/detail-section'
import { ExternalLinks } from '@/components/detail/external-links'
import { TitleFacts } from '@/components/detail/title-facts'
import { TitleNotFound } from '@/components/detail/title-not-found'
import { ProviderStrip } from '@/components/providers/provider-strip'
import { WatchProvidersDialog } from '@/components/providers/watch-providers-dialog'
import { Button } from '@/components/ui/button'
import {
  certificationFor,
  detailTitleOf,
  externalLinksOf,
  leadVideoOf,
  videoWatchUrl,
  type ExternalLink,
} from '../detail'
import {
  providerGroups,
  providerSummaryLine,
  providersFor,
} from '../watch-providers'
import { tvDetailOptions } from '../tv'
import { TitleDetailSections } from './title-detail-sections'
import { SeasonList } from './season-list'
import {
  regionLabel,
  usePreferencesStore,
  type RegionCode,
} from '@/features/preferences/preferences.store'
import { formatCountryCodes, formatDayMonthYear } from '@/lib/tmdb/format'
import { parseTmdbId } from '@/lib/tmdb/id'
import { isTmdbError } from '@/lib/tmdb/errors'
import type { TvDetail } from '@/types/tmdb'

export function TvDetailPage() {
  const { id: rawId } = useParams()
  const id = parseTmdbId(rawId)
  const language = usePreferencesStore((state) => state.language)
  const region = usePreferencesStore((state) => state.region)
  const [providersOpen, setProvidersOpen] = useState(false)

  const query = useQuery({
    ...tvDetailOptions(id ?? 0, language),
    enabled: id !== null,
  })

  if (id === null) {
    return (
      <DetailPage>
        <TitleNotFound
          subject="series"
          action={{ label: 'Browse series', to: '/discover/tv' }}
        />
      </DetailPage>
    )
  }

  if (query.isPending) {
    return (
      <DetailPage>
        <DetailSkeleton address="this series" />
      </DetailPage>
    )
  }

  if (query.isError) {
    if (isTmdbError(query.error) && query.error.kind === 'not-found') {
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
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      </DetailPage>
    )
  }

  const detail = query.data

  return (
    <DetailPage>
      <TvBody
        detail={detail}
        region={region}
        onOpenProviders={() => setProvidersOpen(true)}
      />
      <WatchProvidersDialog
        open={providersOpen}
        onOpenChange={setProvidersOpen}
        title={detail.name}
        regionLabel={regionLabel(region)}
        groups={providerGroups(providersFor(detail['watch/providers'], region))}
      />
    </DetailPage>
  )
}

type TvBodyProps = {
  detail: TvDetail
  region: RegionCode
  onOpenProviders: () => void
}

function TvBody({ detail, region, onOpenProviders }: TvBodyProps) {
  const title = detailTitleOf(detail)
  const trailer = leadVideoOf(detail.videos?.results)
  const groups = providerGroups(providersFor(detail['watch/providers'], region))
  const nextEpisode = detail.next_episode_to_air
  const lastEpisode = detail.last_episode_to_air

  return (
    <>
      <DetailHero
        address="Series"
        title={title.title}
        tagline={title.tagline}
        backdropPath={title.backdropPath}
        score={title.score}
        caption={providerSummaryLine(groups)}
        overview={title.overview}>
        <div className="flex flex-col items-start gap-2">
          {trailer !== null && (
            <Button
              variant="outline"
              size="sm"
              className="min-h-11 sm:min-h-0"
              nativeButton={false}
              render={
                <a
                  href={videoWatchUrl(trailer)}
                  target="_blank"
                  rel="noreferrer noopener"
                />
              }>
              <PlayIcon />
              Watch trailer
            </Button>
          )}
          <ProviderStrip
            groups={groups}
            regionLabel={regionLabel(region)}
            onOpenAll={onOpenProviders}
          />
        </div>
      </DetailHero>

      <TitleFacts
        items={[
          {
            term: 'First aired',
            description: formatDayMonthYear(detail.first_air_date),
          },
          { term: 'Episode run', description: title.runtime },
          { term: 'Rating', description: certificationFor(detail, region) },
          { term: 'Status', description: title.status },
          {
            term: 'Format',
            description: detail.type === '' ? null : detail.type,
          },
          {
            term: 'Seasons',
            description:
              detail.number_of_seasons > 0
                ? `${detail.number_of_seasons} ${detail.number_of_seasons === 1 ? 'season' : 'seasons'}, ${detail.number_of_episodes} ${detail.number_of_episodes === 1 ? 'episode' : 'episodes'}`
                : null,
          },
          { term: 'Language', description: title.language },
          {
            term: 'Country',
            description: formatCountryCodes(detail.origin_country),
          },
          {
            term: 'Networks',
            description:
              detail.networks.length > 0
                ? detail.networks.map((network) => network.name).join(', ')
                : null,
          },
          {
            term: 'Genres',
            description:
              detail.genres.length > 0
                ? detail.genres.map((genre) => genre.name).join(', ')
                : null,
          },
          {
            term: 'Next episode',
            description:
              nextEpisode !== null
                ? `S${nextEpisode.season_number}E${nextEpisode.episode_number}, ${nextEpisode.air_date ?? 'date unannounced'}`
                : null,
          },
          {
            term: 'Latest episode',
            description:
              lastEpisode !== null
                ? `S${lastEpisode.season_number}E${lastEpisode.episode_number}, ${lastEpisode.air_date ?? 'date unannounced'}`
                : null,
          },
        ]}
      />

      <DetailSection
        label="Seasons"
        heading={`${detail.number_of_seasons} ${detail.number_of_seasons === 1 ? 'season' : 'seasons'}`}
        action={
          <Link
            to={`/search?q=${encodeURIComponent(detail.name)}`}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
            Search for more
          </Link>
        }>
        <SeasonList showId={detail.id} seasons={detail.seasons} />
      </DetailSection>

      <ExternalLinksSection
        links={externalLinksOf(detail, detail.external_ids)}
      />

      <TitleDetailSections
        title={detail.name}
        detail={detail}
        credits={detail.credits}
        reviews={detail.reviews?.results ?? []}
        recommendations={detail.recommendations?.results ?? []}
        similar={detail.similar?.results ?? []}
      />
    </>
  )
}

function ExternalLinksSection({ links }: { links: ExternalLink[] }) {
  if (links.length === 0) return null

  return (
    <DetailSection
      label="Elsewhere"
      heading="Other pages for this series"
      action={
        <ExternalLinkIcon
          aria-hidden
          className="size-4 text-muted-foreground"
        />
      }>
      <ExternalLinks links={links} className="flex flex-wrap gap-x-6 gap-y-1" />
    </DetailSection>
  )
}
