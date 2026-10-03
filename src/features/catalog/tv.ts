import { queryOptions } from '@tanstack/react-query'
import { tmdbGet } from '@/lib/tmdb/client'
import { endpoints, TV_APPEND } from '@/lib/tmdb/endpoints'
import type { SeasonDetail, TvDetail } from '@/types/tmdb'
import { DETAIL_STALE_TIME } from './movies'

export function tvDetailOptions(id: number, language: string) {
  const path = endpoints.tvDetail(id)
  return queryOptions({
    queryKey: ['tv', 'detail', path, id, language],
    queryFn: ({ signal }) =>
      tmdbGet<TvDetail>(path, {
        params: { append_to_response: TV_APPEND },
        signal,
      }),
    staleTime: DETAIL_STALE_TIME,
    refetchOnWindowFocus: true,
  })
}

/**
 * A season page also needs the show it belongs to, for the header and the season
 * switcher. TMDB cannot return both in one call, so the show is a second query
 * that the season route shares with the detail route and therefore serves from
 * cache when the reader arrived from there.
 */
export function seasonOptions(
  id: number,
  seasonNumber: number,
  language: string,
) {
  const path = endpoints.tvSeason(id, seasonNumber)
  return queryOptions({
    queryKey: ['tv', path, id, seasonNumber, language],
    queryFn: ({ signal }) => tmdbGet<SeasonDetail>(path, { signal }),
    staleTime: DETAIL_STALE_TIME,
    refetchOnWindowFocus: true,
  })
}
