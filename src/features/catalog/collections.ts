import { queryOptions } from '@tanstack/react-query'
import { tmdbGet } from '@/lib/tmdb/client'
import { COLLECTION_APPEND, endpoints } from '@/lib/tmdb/endpoints'
import type { CollectionDetail } from '@/types/tmdb'
import { DETAIL_STALE_TIME } from './movies'

export function collectionDetailOptions(id: number, language: string) {
  const path = endpoints.collectionDetail(id)
  return queryOptions({
    queryKey: ['collection', path, id, language],
    queryFn: ({ signal }) =>
      tmdbGet<CollectionDetail>(path, {
        params: { append_to_response: COLLECTION_APPEND },
        signal,
      }),
    staleTime: DETAIL_STALE_TIME,
    refetchOnWindowFocus: true,
  })
}
