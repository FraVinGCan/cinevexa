import { queryOptions } from '@tanstack/react-query'
import { tmdbGet } from '@/lib/tmdb/client'
import { endpoints } from '@/lib/tmdb/endpoints'
import type {
  Keyword,
  KeywordSearchResult,
  Paged,
  TitleListItem,
} from '@/types/tmdb'
import { DETAIL_STALE_TIME } from './movies'

const KEYWORD_STALE_TIME = 5 * 60 * 1000

/** Only the keyword's own name, which is what a keyword page is addressed by. */
export function keywordDetailOptions(id: number, language: string) {
  const path = endpoints.keywordDetail(id)
  return queryOptions({
    queryKey: ['keyword', path, id, language],
    queryFn: ({ signal }) => tmdbGet<Keyword>(path, { signal }),
    staleTime: DETAIL_STALE_TIME,
  })
}

export function keywordSearchOptions(query: string, page: number) {
  const path = endpoints.keywordSearch()
  const term = query.trim()
  return queryOptions({
    queryKey: ['keyword', path, term, page],
    queryFn: ({ signal }) =>
      tmdbGet<KeywordSearchResult>(path, {
        params: { query: term, page },
        signal,
      }),
    enabled: term !== '',
    staleTime: KEYWORD_STALE_TIME,
  })
}

export function keywordMoviesOptions(
  id: number,
  page: number,
  language: string,
) {
  const path = endpoints.keywordMovies(id)
  return queryOptions({
    queryKey: ['keyword', path, id, page, language],
    queryFn: ({ signal }) =>
      tmdbGet<Paged<TitleListItem>>(path, { params: { page }, signal }),
    staleTime: KEYWORD_STALE_TIME,
  })
}
