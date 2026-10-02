import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MediaRail } from '@/components/media/media-rail'
import { PosterCard } from '@/components/media/poster-card'
import { ErrorState } from '@/components/feedback/error-state'
import { MediaRailSkeleton } from '@/components/feedback/media-rail-skeleton'
import {
  railOptions,
  type CatalogueRailDefinition,
} from '@/features/catalog/rails'
import {
  isTrendingTitle,
  TRENDING_LABELS,
  trendingOptions,
} from '@/features/catalog/trending'
import { usePreferencesStore } from '@/features/preferences/preferences.store'
import { mediaTypeOf } from '@/lib/tmdb/format'
import type {
  TitleListItem,
  TrendingResult,
  TrendingWindow,
} from '@/types/tmdb'

const RAIL_CARD_CLASS = 'w-36 shrink-0 snap-start sm:w-40 xl:w-44'

const NO_ITEMS: TitleListItem[] = []

const NO_TRENDING_RESULTS: TrendingResult[] = []

type RailShellProps = {
  label: string
  to: string | null
  isPending: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
  items: TitleListItem[]
}

function RailShell({
  label,
  to,
  isPending,
  isError,
  error,
  onRetry,
  items,
}: RailShellProps) {
  if (isPending) return <MediaRailSkeleton cardClassName={RAIL_CARD_CLASS} />

  return (
    <MediaRail label={label} to={to}>
      {isError ? (
        <div className="w-full min-w-0">
          <ErrorState
            error={error}
            onRetry={onRetry}
            action={{ label: 'Browse movies', to: '/discover/movies' }}
          />
        </div>
      ) : items.length === 0 ? (
        <p className="w-full min-w-0 rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
          TMDB has no titles on this channel right now. Retry in a moment, or
          open the full catalogue.
        </p>
      ) : (
        items.map((item) => (
          <PosterCard
            key={`${mediaTypeOf(item)}-${item.id}`}
            item={item}
            className={RAIL_CARD_CLASS}
          />
        ))
      )}
    </MediaRail>
  )
}

type CatalogueRailProps = {
  definition: CatalogueRailDefinition
}

export function CatalogueRail({ definition }: CatalogueRailProps) {
  const region = usePreferencesStore((state) => state.region)
  const language = usePreferencesStore((state) => state.language)
  const query = useQuery(railOptions(definition, region, language))

  return (
    <RailShell
      label={definition.label}
      to={definition.to}
      isPending={query.isPending}
      isError={query.isError}
      error={query.error}
      onRetry={() => query.refetch()}
      items={query.data?.results ?? NO_ITEMS}
    />
  )
}

type TrendingRailProps = {
  trendingWindow: TrendingWindow
}

export function TrendingRail({ trendingWindow }: TrendingRailProps) {
  const query = useQuery(trendingOptions('all', trendingWindow))

  const items = useMemo(
    () => (query.data?.results ?? NO_TRENDING_RESULTS).filter(isTrendingTitle),
    [query.data],
  )

  return (
    <RailShell
      label={TRENDING_LABELS[trendingWindow]}
      to={null}
      isPending={query.isPending}
      isError={query.isError}
      error={query.error}
      onRetry={() => query.refetch()}
      items={items}
    />
  )
}
