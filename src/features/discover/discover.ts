import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { tmdbGet } from '@/lib/tmdb/client'
import { endpoints } from '@/lib/tmdb/endpoints'
import type { TmdbParams } from '@/lib/tmdb/params'
import type { Paged, TitleListItem } from '@/types/tmdb'
import type {
  DiscoverFilters,
  DiscoverMediaType,
  DiscoverSearchState,
} from './discover.schema'

export const DISCOVER_PAGE_SIZE = 20

/**
 * TMDB answers any page beyond 500 with a 422 rather than an empty page, but the
 * `total_pages` it reports keeps counting well past that limit. Requests are
 * therefore bounded here, and the pagination range is bounded the same way, so
 * the last reachable page is never one the API would reject.
 */
export const MAX_DISCOVER_PAGE = 500

const DISCOVER_STALE_TIME = 3 * 60 * 1000

/** Filter edits are expressed as URL-key patches, so the URL stays the only state. */
export type DiscoverPatch = Record<string, string | null>

export type DiscoverPreferences = {
  region: string
  language: string
  includeAdult: boolean
}

/**
 * TMDB reads a comma as OR for genres but expects a pipe for these lists, and a
 * wrongly separated list answers 200 with an empty page instead of an error. The
 * separator is therefore chosen here rather than in the shared serializer, which
 * stays comma-based for every other endpoint.
 */
function serializeOrList(
  values: readonly (string | number)[],
): string | undefined {
  return values.length > 0 ? values.join('|') : undefined
}

/**
 * UI range filters arrive as separate bounds and TMDB wants one comparison per
 * boundary, keyed by whichever date field the media type actually uses.
 */
export function discoverParams(
  mediaType: DiscoverMediaType,
  filters: DiscoverFilters,
  preferences: DiscoverPreferences,
): TmdbParams {
  const dateKey = mediaType === 'tv' ? 'first_air_date' : 'primary_release_date'
  const params: TmdbParams = {
    include_adult: preferences.includeAdult,
    include_video: false,
    sort_by: filters.sortBy ?? 'popularity.desc',
    with_watch_monetization_types: serializeOrList(filters.monetization),
    with_certification: filters.certification,
    certification_country: filters.certificationCountry,
    with_original_language: filters.originalLanguage,
    'vote_count.gte': filters.voteCountFrom,
    'vote_average.gte': filters.voteAverageFrom,
    [`${dateKey}.gte`]: filters.yearFrom,
    [`${dateKey}.lte`]: filters.yearTo,
  }
  if (mediaType === 'tv') {
    params.with_status = serializeOrList(filters.statuses)
    params.with_type = serializeOrList(filters.types)
  } else {
    params.with_release_type = serializeOrList(filters.releaseTypes)
  }
  if (filters.genres.length > 0) params.with_genres = filters.genres
  if (filters.withoutGenres.length > 0)
    params.without_genres = filters.withoutGenres
  if (filters.runtimeFrom !== null)
    params['with_runtime.gte'] = filters.runtimeFrom
  if (filters.runtimeTo !== null) params['with_runtime.lte'] = filters.runtimeTo
  return params
}

export function discoverOptions(
  mediaType: DiscoverMediaType,
  state: DiscoverSearchState,
  preferences: DiscoverPreferences,
) {
  const path = endpoints.discover(mediaType)
  const params = discoverParams(mediaType, state.filters, preferences)
  const page = Math.min(state.page, MAX_DISCOVER_PAGE)
  return queryOptions({
    /**
     * Region and language are injected into every request by the client rather
     * than passed here, so they have to be named in the key explicitly;
     * otherwise a preference change replays the previous locale's results.
     */
    queryKey: [
      'discover',
      mediaType,
      path,
      params,
      page,
      preferences.region,
      preferences.language,
    ],
    queryFn: ({ signal }) =>
      tmdbGet<Paged<TitleListItem>>(path, {
        params: { ...params, page },
        signal,
      }),
    /**
     * The outgoing page stays on screen while the next one is in flight, so the
     * document never shortens and the viewport keeps its place.
     */
    placeholderData: keepPreviousData,
    staleTime: DISCOVER_STALE_TIME,
  })
}

/**
 * Filter edits always return to page one; only an explicit page change may keep
 * the current page.
 */
export function discoverSearch(
  current: URLSearchParams,
  patch: Record<string, string | null>,
): URLSearchParams {
  const next = new URLSearchParams(current)
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === '') next.delete(key)
    else next.set(key, value)
  }
  if (patch.page === undefined) next.delete('page')
  return next
}

export function serializeValues(values: readonly (string | number)[]): string {
  return values.join(',')
}

export function formatResultCount(count: number): string {
  return new Intl.NumberFormat('en-US').format(count)
}
