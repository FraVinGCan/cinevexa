import { queryOptions } from '@tanstack/react-query'
import { tmdbGet } from '@/lib/tmdb/client'
import { endpoints } from '@/lib/tmdb/endpoints'
import type { Certifications } from '@/types/tmdb'

/** Certifications are re-rated rarely and never within a session. */
export const CERTIFICATIONS_STALE_TIME = Infinity

const NO_CERTIFICATIONS: readonly string[] = []

export function certificationsOptions(country: string) {
  const path = endpoints.certifications()
  return queryOptions({
    queryKey: ['certifications', country, path],
    queryFn: ({ signal }) =>
      tmdbGet<Certifications>(path, {
        params: { certification_country: country },
        signal,
      }),
    staleTime: CERTIFICATIONS_STALE_TIME,
  })
}

export function certificationsFor(
  certifications: Certifications | undefined,
  country: string,
): readonly string[] {
  return certifications?.[country.toUpperCase()] ?? NO_CERTIFICATIONS
}
