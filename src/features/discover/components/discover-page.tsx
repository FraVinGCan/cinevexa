import { useCallback, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  certificationsFor,
  certificationsOptions,
} from '@/features/catalog/certifications'
import { genreName, genresOptions, genresOf } from '@/features/catalog/genres'
import { usePreferencesStore } from '@/features/preferences/preferences.store'
import {
  MAX_DISCOVER_PAGE,
  discoverOptions,
  discoverSearch,
  type DiscoverPatch,
} from '@/features/discover/discover'
import {
  DISCOVER_SEGMENTS,
  discoverSegmentOf,
  parseDiscoverSearch,
  type DiscoverMediaType,
  type DiscoverSegment,
} from '@/features/discover/discover.schema'
import {
  activeChips,
  clearAllPatch,
  type ActiveChip,
} from '@/features/discover/active-filters'
import { ActiveFilterChips } from './active-filter-chips'
import { DiscoverFilterShell } from './discover-filters'
import { DiscoverResults } from './discover-results'
import { NumberedPagination } from '@/components/pagination/numbered-pagination'
import { cn } from 'cn'

const SEGMENT_LABELS: Record<DiscoverSegment, string> = {
  movies: 'Movies',
  tv: 'TV',
}

const MEDIA_LABELS: Record<DiscoverMediaType, string> = {
  movie: 'films',
  tv: 'series',
}

type DiscoverPageProps = {
  mediaType: DiscoverMediaType
}

/**
 * Every filter, sort and page value is read from the URL and written back to it,
 * so the address is the whole state and the back button stays honest.
 */
export function DiscoverPage({ mediaType }: DiscoverPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const segment = discoverSegmentOf(mediaType)
  const region = usePreferencesStore((state) => state.region)
  const language = usePreferencesStore((state) => state.language)
  const includeAdult = usePreferencesStore((state) => state.includeAdult)

  const search = parseDiscoverSearch(searchParams, mediaType)

  /**
   * A shared URL can pin a different market than the stored preference, and the
   * rating list has to describe the market the request is actually filtered by.
   */
  const certificationCountry = search.filters.certificationCountry ?? region

  const patch = useCallback(
    (changes: DiscoverPatch) => {
      const next = { ...changes }
      if (next.with_certification && !next.certification_country) {
        next.certification_country =
          search.filters.certificationCountry ?? region
      }
      setSearchParams(discoverSearch(searchParams, next), {
        preventScrollReset: true,
      })
    },
    [
      region,
      search.filters.certificationCountry,
      searchParams,
      setSearchParams,
    ],
  )

  const discoverQuery = useQuery(
    discoverOptions(mediaType, search, { region, language, includeAdult }),
  )
  const genresQuery = useQuery(genresOptions(mediaType))
  const certificationsQuery = useQuery(
    certificationsOptions(certificationCountry),
  )

  const genres = genresOf(genresQuery.data)
  const certifications = certificationsFor(
    certificationsQuery.data,
    certificationCountry,
  )
  const chips = activeChips(search.filters, mediaType, (id) =>
    genreName(genresQuery.data, id),
  )
  const totalPages = Math.min(
    discoverQuery.data?.total_pages ?? 0,
    MAX_DISCOVER_PAGE,
  )

  /**
   * TMDB rejects a page past the end of the result set instead of returning an
   * empty one, so a stale or hand-edited `page` would land on an error screen.
   * Once the real range is known the address is corrected, replacing rather than
   * pushing so the back button does not bounce through the correction.
   */
  useEffect(() => {
    if (totalPages === 0 || search.page <= totalPages) return
    setSearchParams(
      discoverSearch(searchParams, { page: String(totalPages) }),
      {
        replace: true,
        preventScrollReset: true,
      },
    )
  }, [search.page, searchParams, setSearchParams, totalPages])

  const pageHref = useCallback(
    (page: number) => {
      const next = discoverSearch(searchParams, {
        page: page <= 1 ? null : String(page),
      })
      const query = next.toString()
      return query === ''
        ? `/discover/${segment}`
        : `/discover/${segment}?${query}`
    },
    [searchParams, segment],
  )

  const segmentHref = useCallback(
    (target: DiscoverSegment) => {
      const next = new URLSearchParams(searchParams)
      if (target === 'tv') next.delete('with_release_type')
      else {
        next.delete('with_status')
        next.delete('with_type')
      }
      const query = next.toString()
      return query === ''
        ? `/discover/${target}`
        : `/discover/${target}?${query}`
    },
    [searchParams],
  )

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs tracking-[0.2em] text-primary uppercase">
              Discover
            </p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Browse {MEDIA_LABELS[mediaType]}
            </h1>
          </div>
          <nav aria-label="Media type">
            <ul className="flex gap-1 rounded-3xl bg-muted p-1">
              {DISCOVER_SEGMENTS.map((entry) => (
                <li key={entry}>
                  <Link
                    to={segmentHref(entry)}
                    aria-current={entry === segment ? 'page' : undefined}
                    className={cn(
                      'flex min-h-9 items-center rounded-3xl px-4 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
                      entry === segment
                        ? 'bg-card text-card-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}>
                    {SEGMENT_LABELS[entry]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:gap-8">
        <DiscoverFilterShell
          mediaType={mediaType}
          filters={search.filters}
          genres={genres}
          certifications={certifications}
          activeCount={chips.length}
          resultCount={discoverQuery.data?.total_results}
          isPending={discoverQuery.isPending}
          onPatch={patch}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <ActiveFilterRow
            chips={chips}
            resultCount={discoverQuery.data?.total_results}
            onPatch={patch}
          />

          <DiscoverResults
            data={discoverQuery.data}
            error={discoverQuery.error}
            isPending={discoverQuery.isPending}
            isFetching={discoverQuery.isFetching}
            onRetry={() => discoverQuery.refetch()}
            hasFilters={chips.length > 0}
            onClearAll={() => patch(clearAllPatch())}
          />

          <NumberedPagination
            page={search.page}
            totalPages={totalPages}
            buildHref={pageHref}
          />
        </div>
      </div>
    </div>
  )
}

type ActiveFilterRowProps = {
  chips: ActiveChip[]
  resultCount: number | undefined
  onPatch: (patch: DiscoverPatch) => void
}

function ActiveFilterRow({
  chips,
  resultCount,
  onPatch,
}: ActiveFilterRowProps) {
  if (chips.length === 0 && resultCount === undefined) return null
  return (
    <ActiveFilterChips
      chips={chips}
      resultCount={resultCount}
      onPatch={onPatch}
    />
  )
}
