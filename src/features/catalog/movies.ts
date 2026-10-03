import { queryOptions } from '@tanstack/react-query'
import { tmdbGet } from '@/lib/tmdb/client'
import { endpoints, MOVIE_APPEND } from '@/lib/tmdb/endpoints'
import type { MovieDetail } from '@/types/tmdb'

/**
 * A detail page is one request, and its answer barely moves: credits, artwork,
 * reviews, and providers are all appended to it. Ten minutes keeps a review or a
 * provider list from re-fanning a whole page's worth of requests on every visit.
 */
export const DETAIL_STALE_TIME = 10 * 60 * 1000

export function movieDetailOptions(id: number, language: string) {
  const path = endpoints.movieDetail(id)
  return queryOptions({
    /**
     * The client injects the language into every request rather than this
     * factory passing it, so it is named in the key explicitly; otherwise a
     * language change replays the previous locale's page.
     */
    queryKey: ['movies', 'detail', path, id, language],
    queryFn: ({ signal }) =>
      tmdbGet<MovieDetail>(path, {
        params: { append_to_response: MOVIE_APPEND },
        signal,
      }),
    staleTime: DETAIL_STALE_TIME,
    refetchOnWindowFocus: true,
  })
}
