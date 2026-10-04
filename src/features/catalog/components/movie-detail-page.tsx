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
import { movieDetailOptions } from '../movies'
import {
  providerGroups,
  providerSummaryLine,
  providersFor,
} from '../watch-providers'
import { TitleDetailSections } from './title-detail-sections'
import { LibraryActions } from '@/features/account/components/library-actions'
import {
  regionLabel,
  usePreferencesStore,
  type RegionCode,
} from '@/features/preferences/preferences.store'
import {
  formatCountryCodes,
  formatDayMonthYear,
  formatMoney,
} from '@/lib/tmdb/format'
import { parseTmdbId } from '@/lib/tmdb/id'
import { isTmdbError } from '@/lib/tmdb/errors'
import type { MovieDetail } from '@/types/tmdb'

export function MovieDetailPage() {
  const { id: rawId } = useParams()
  const id = parseTmdbId(rawId)
  const language = usePreferencesStore((state) => state.language)
  const region = usePreferencesStore((state) => state.region)
  const [providersOpen, setProvidersOpen] = useState(false)

  const query = useQuery({
    ...movieDetailOptions(id ?? 0, language),
    enabled: id !== null,
  })

  if (id === null) {
    return (
      <DetailPage>
        <TitleNotFound subject="film" />
      </DetailPage>
    )
  }

  if (query.isPending) {
    return (
      <DetailPage>
        <DetailSkeleton address="this film" />
      </DetailPage>
    )
  }

  if (query.isError) {
    if (isTmdbError(query.error) && query.error.kind === 'not-found') {
      return (
        <DetailPage>
          <TitleNotFound subject="film" />
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
      <MovieBody
        detail={detail}
        region={region}
        onOpenProviders={() => setProvidersOpen(true)}
      />
      <WatchProvidersDialog
        open={providersOpen}
        onOpenChange={setProvidersOpen}
        title={detail.title}
        regionLabel={regionLabel(region)}
        groups={providerGroups(providersFor(detail['watch/providers'], region))}
      />
    </DetailPage>
  )
}

type MovieBodyProps = {
  detail: MovieDetail
  region: RegionCode
  onOpenProviders: () => void
}

function MovieBody({ detail, region, onOpenProviders }: MovieBodyProps) {
  const title = detailTitleOf(detail)
  const trailer = leadVideoOf(detail.videos?.results)
  const groups = providerGroups(providersFor(detail['watch/providers'], region))
  const collection = detail.belongs_to_collection

  return (
    <>
      <DetailHero
        address="Film"
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
          <LibraryActions mediaType="movie" id={detail.id} />
        </div>
      </DetailHero>

      <TitleFacts
        items={[
          {
            term: 'Released',
            description: formatDayMonthYear(detail.release_date),
          },
          { term: 'Runtime', description: title.runtime },
          { term: 'Rating', description: certificationFor(detail, region) },
          { term: 'Status', description: title.status },
          { term: 'Language', description: title.language },
          {
            term: 'Country',
            description: formatCountryCodes(detail.origin_country),
          },
          {
            term: 'Genres',
            description:
              detail.genres.length > 0
                ? detail.genres.map((genre) => genre.name).join(', ')
                : null,
          },
          { term: 'Budget', description: formatMoney(detail.budget) },
          { term: 'Revenue', description: formatMoney(detail.revenue) },
        ]}
      />

      {collection !== null && (
        <DetailSection label="Collection" heading={collection.name}>
          <p className="max-w-[65ch] text-sm text-muted-foreground">
            Part of{' '}
            <Link
              to={`/collection/${collection.id}`}
              className="font-medium text-card-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
              {collection.name}
            </Link>
            . Every film it holds is listed on that collection&apos;s own page.
          </p>
        </DetailSection>
      )}

      <ExternalLinksSection
        links={externalLinksOf(detail, detail.external_ids)}
      />

      <TitleDetailSections
        title={detail.title}
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
      heading="Other pages for this film"
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
