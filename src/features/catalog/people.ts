import { queryOptions } from '@tanstack/react-query'
import { tmdbGet } from '@/lib/tmdb/client'
import { endpoints, PERSON_APPEND } from '@/lib/tmdb/endpoints'
import type { PersonDetail } from '@/types/tmdb'
import { DETAIL_STALE_TIME } from './movies'

/**
 * A person page is one request: biography, portrait set, and the whole filmography
 * arrive together, because the filmography is the reason to open the page.
 */
export function personDetailOptions(id: number, language: string) {
  const path = endpoints.personDetail(id)
  return queryOptions({
    queryKey: ['person', path, id, language],
    queryFn: ({ signal }) =>
      tmdbGet<PersonDetail>(path, {
        params: { append_to_response: PERSON_APPEND },
        signal,
      }),
    staleTime: DETAIL_STALE_TIME,
    refetchOnWindowFocus: true,
  })
}
