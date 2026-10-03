import { queryOptions } from '@tanstack/react-query'
import { tmdbGet } from '@/lib/tmdb/client'
import { endpoints, type TitleMediaType } from '@/lib/tmdb/endpoints'
import type { Genre, GenreList } from '@/types/tmdb'

/** The genre taxonomy changes a few times a year and never within a session. */
export const GENRES_STALE_TIME = Infinity

const NO_GENRES: Genre[] = []

export function genresOptions(mediaType: TitleMediaType) {
  const path = endpoints.genres(mediaType)
  return queryOptions({
    queryKey: ['genres', mediaType, path],
    queryFn: ({ signal }) => tmdbGet<GenreList>(path, { signal }),
    staleTime: GENRES_STALE_TIME,
  })
}

export function genresOf(genres: GenreList | undefined): Genre[] {
  return genres?.genres ?? NO_GENRES
}

export function genreName(genres: GenreList | undefined, id: number): string {
  return genres?.genres.find((genre) => genre.id === id)?.name ?? `Genre ${id}`
}
