import { queryOptions } from '@tanstack/react-query'
import { tmdbGet } from '@/lib/tmdb/client'
import { endpoints } from '@/lib/tmdb/endpoints'
import type {
  TrendingList,
  TrendingResult,
  TrendingScope,
  TrendingTitle,
  TrendingWindow,
} from '@/types/tmdb'

export const TRENDING_STALE_TIME = 5 * 60 * 1000

export const TRENDING_WINDOWS = ['day', 'week'] as const

export const TRENDING_LABELS: Record<TrendingWindow, string> = {
  day: 'Trending today',
  week: 'Trending this week',
}

export function isTrendingTitle(
  result: TrendingResult,
): result is TrendingTitle {
  return result.media_type === 'movie' || result.media_type === 'tv'
}

export function trendingOptions(scope: TrendingScope, window: TrendingWindow) {
  return queryOptions({
    queryKey: ['trending', scope, window],
    queryFn: ({ signal }) =>
      tmdbGet<TrendingList>(endpoints.trending(scope, window), { signal }),
    staleTime: TRENDING_STALE_TIME,
  })
}
