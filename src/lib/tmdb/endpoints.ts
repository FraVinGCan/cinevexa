import type { MediaType, TrendingScope, TrendingWindow } from '@/types/tmdb'

export const MOVIE_APPEND = [
  'credits',
  'videos',
  'images',
  'recommendations',
  'similar',
  'watch/providers',
  'reviews',
  'release_dates',
  'external_ids',
] as const

export const TV_APPEND = [
  'credits',
  'content_ratings',
  'videos',
  'images',
  'recommendations',
  'similar',
  'watch/providers',
  'reviews',
  'external_ids',
] as const

export type MovieRail = 'now_playing' | 'popular' | 'top_rated' | 'upcoming'
export type TvRail = 'popular' | 'top_rated' | 'on_the_air' | 'airing_today'
export type AccountListKind = 'watchlist' | 'favorite' | 'rated'
export type TitleMediaType = 'movie' | 'tv'

export const endpoints = {
  configuration: () => '/configuration',
  genres: (mediaType: 'movie' | 'tv') => `/genre/${mediaType}/list`,
  certifications: () => '/certification/movie/list',
  trending: (scope: TrendingScope, window: TrendingWindow) =>
    `/trending/${scope}/${window}`,
  movieRail: (rail: MovieRail) => `/movie/${rail}`,
  tvRail: (rail: TvRail) => `/tv/${rail}`,
  movieDetail: (id: number) => `/movie/${id}`,
  tvDetail: (id: number) => `/tv/${id}`,
  tvSeason: (id: number, seasonNumber: number) =>
    `/tv/${id}/season/${seasonNumber}`,
  personDetail: (id: number) => `/person/${id}`,
  collectionDetail: (id: number) => `/collection/${id}`,
  keywordSearch: () => '/keyword/search',
  keywordMovies: (id: number) => `/keyword/${id}/movies`,
  discover: (mediaType: TitleMediaType) => `/discover/${mediaType}`,
  search: (mediaType: MediaType) => `/search/${mediaType}`,
  account: () => '/account',
  accountMediaList: (
    accountId: number,
    kind: AccountListKind,
    mediaType: TitleMediaType,
  ) =>
    kind === 'watchlist'
      ? `/account/${accountId}/watchlist/${mediaType}`
      : kind === 'favorite'
        ? `/account/${accountId}/favorite/${mediaType}`
        : `/account/${accountId}/rated/${mediaType}`,
  accountLists: (accountId: number) => `/account/${accountId}/lists`,
  list: (listId: number) => `/list/${listId}`,
  createList: () => '/list',
  clearList: (listId: number) => `/list/${listId}/clear`,
  addListItem: (listId: number) => `/list/${listId}/add_item`,
  removeListItem: (listId: number) => `/list/${listId}/remove_item`,
  accountStates: (mediaType: TitleMediaType | 'episode', id: number) =>
    `/${mediaType}/${id}/account_states`,
  requestToken: () => '/authentication/token/new',
  createSession: () => '/authentication/session/new',
  deleteSession: () => '/authentication/session',
  favorite: (accountId: number) => `/account/${accountId}/favorite`,
  watchlist: (accountId: number) => `/account/${accountId}/watchlist`,
  rateTitle: (mediaType: TitleMediaType, id: number) =>
    `/${mediaType}/${id}/rating`,
  rateEpisode: (episodeId: number) => `/tv/episode/${episodeId}/rating`,
} as const

export const v4Endpoints = {
  recommendations: (accountObjectId: string, mediaType: TitleMediaType) =>
    `/account/${accountObjectId}/${mediaType}/recommendations`,
} as const
