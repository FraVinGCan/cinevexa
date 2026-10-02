import { queryOptions } from '@tanstack/react-query'
import { tmdbGet } from '@/lib/tmdb/client'
import { endpoints, type MovieRail, type TvRail } from '@/lib/tmdb/endpoints'
import type { Paged, TitleListItem } from '@/types/tmdb'

export const RAIL_STALE_TIME = 5 * 60 * 1000

type MovieRailDefinition = {
  id: MovieRail
  mediaType: 'movie'
  label: string
  to: string | null
}

type TvRailDefinition = {
  id: TvRail
  mediaType: 'tv'
  label: string
  to: string | null
}

export type CatalogueRailDefinition = MovieRailDefinition | TvRailDefinition

/**
 * `to` is the discover address that reproduces the rail, and is null where
 * discover has no equivalent filter rather than a misleading substitute.
 */
const MOVIE_RAILS = [
  {
    id: 'now_playing',
    mediaType: 'movie',
    label: 'Now playing',
    to: '/discover/movies?with_release_type=2%7C3&sort_by=primary_release_date.desc',
  },
  {
    id: 'popular',
    mediaType: 'movie',
    label: 'Popular films',
    to: '/discover/movies?sort_by=popularity.desc',
  },
  {
    id: 'top_rated',
    mediaType: 'movie',
    label: 'Top rated films',
    to: '/discover/movies?sort_by=vote_average.desc',
  },
  { id: 'upcoming', mediaType: 'movie', label: 'Coming soon', to: null },
] as const satisfies readonly MovieRailDefinition[]

const TV_RAILS = [
  {
    id: 'popular',
    mediaType: 'tv',
    label: 'Popular series',
    to: '/discover/tv?sort_by=popularity.desc',
  },
  {
    id: 'top_rated',
    mediaType: 'tv',
    label: 'Top rated series',
    to: '/discover/tv?sort_by=vote_average.desc',
  },
  { id: 'on_the_air', mediaType: 'tv', label: 'On the air', to: null },
] as const satisfies readonly TvRailDefinition[]

export const CATALOGUE_RAILS: readonly CatalogueRailDefinition[] = [
  ...MOVIE_RAILS,
  ...TV_RAILS,
]

export function railPath(definition: CatalogueRailDefinition): string {
  return definition.mediaType === 'tv'
    ? endpoints.tvRail(definition.id)
    : endpoints.movieRail(definition.id)
}

export function railOptions(
  definition: CatalogueRailDefinition,
  region: string,
  language: string,
) {
  const path = railPath(definition)
  return queryOptions({
    queryKey: ['rail', path, region, language],
    queryFn: ({ signal }) => tmdbGet<Paged<TitleListItem>>(path, { signal }),
    staleTime: RAIL_STALE_TIME,
  })
}
