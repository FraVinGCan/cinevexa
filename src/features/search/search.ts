import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { tmdbGet } from '@/lib/tmdb/client'
import { endpoints } from '@/lib/tmdb/endpoints'
import type { TmdbParams } from '@/lib/tmdb/params'
import type {
  MovieListItem,
  Paged,
  PersonListItem,
  TvListItem,
} from '@/types/tmdb'
import {
  DEFAULT_SEARCH_TAB,
  SEARCH_TAB_LABELS,
  isSearchableQuery,
  type SearchState,
  type SearchTab,
} from './search.schema'

export const SEARCH_PAGE_SIZE = 20

/**
 * TMDB answers a search page past 1000 with a 422 rather than an empty page,
 * while the `total_pages` it reports keeps counting above that. Requests are
 * bounded here, and the pagination range is bounded the same way, so the last
 * reachable page is never one the API would reject.
 */
export const MAX_SEARCH_PAGE = 1000

const SEARCH_STALE_TIME = 3 * 60 * 1000

export type SearchPreferences = {
  region: string
  language: string
  includeAdult: boolean
}

/** Each tab answers with its own result shape, keyed by the tab that asked. */
export type SearchResultMap = {
  movie: MovieListItem
  tv: TvListItem
  person: PersonListItem
}

export type SearchResult<T extends SearchTab = SearchTab> = SearchResultMap[T]

/**
 * The address is derived from the parsed state rather than patched, so the three
 * search keys are the only keys a search address can ever carry.
 */
export function searchHref(state: SearchState): string {
  const search = new URLSearchParams()
  if (state.query !== '') search.set('q', state.query)
  if (state.tab !== DEFAULT_SEARCH_TAB) search.set('type', state.tab)
  if (state.page > 1) search.set('page', String(state.page))
  const query = search.toString()
  return query === '' ? '/search' : `/search?${query}`
}

export function searchResultCountLabel(total: number, tab: SearchTab): string {
  const formatted = new Intl.NumberFormat('en-US').format(total)
  return `${formatted} ${total === 1 ? 'match' : 'matches'} in ${SEARCH_TAB_LABELS[tab].toLowerCase()}`
}

export type SearchRequest = {
  query: string
  page: number
  activeTab: SearchTab
}

export function searchOptions<T extends SearchTab>(
  tab: T,
  request: SearchRequest,
  preferences: SearchPreferences,
) {
  const path = endpoints.search(tab)
  const boundedPage = Math.min(Math.max(request.page, 1), MAX_SEARCH_PAGE)
  const params: TmdbParams = {
    query: request.query.trim(),
    page: boundedPage,
    include_adult: preferences.includeAdult,
  }
  return queryOptions({
    /**
     * Region and language are injected into every request by the client rather
     * than passed here, so they have to be named in the key explicitly;
     * otherwise a preference change replays the previous locale's results.
     */
    queryKey: [
      'search',
      tab,
      path,
      params,
      preferences.region,
      preferences.language,
    ],
    queryFn: ({ signal }) =>
      tmdbGet<Paged<SearchResultMap[T]>>(path, { params, signal }),
    /**
     * Only the tab on screen is asked for, and only once there is something to
     * ask about: three channels per keystroke would spend a rate-limited public
     * key on results nobody has looked at. A channel already answered is served
     * from cache by `staleTime`, so returning to it is still instant.
     */
    enabled: request.activeTab === tab && isSearchableQuery(request.query),
    /**
     * The outgoing page stays on screen while the next one is in flight, so the
     * document never shortens and the viewport keeps its place.
     */
    placeholderData: keepPreviousData,
    staleTime: SEARCH_STALE_TIME,
  })
}
