export type Paged<T> = {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export type MediaType = 'movie' | 'tv' | 'person'

export type TrendingScope = MediaType | 'all'

export type TrendingWindow = 'day' | 'week'

export type GenreList = {
  genres: Genre[]
}

export type Genre = {
  id: number
  name: string
}

export type Certifications = Record<string, readonly string[]>

export type Configuration = {
  images: {
    base_url: string
    secure_base_url: string
    backdrop_sizes: string[]
    logo_sizes: string[]
    poster_sizes: string[]
    profile_sizes: string[]
    still_sizes: string[]
  }
  change_keys: string[]
}

export type Keyword = {
  id: number
  name: string
}

export type KeywordSearchResult = Paged<Keyword>

export type ExternalIds = {
  imdb_id: string | null
  facebook_id: string | null
  instagram_id: string | null
  twitter_id: string | null
  wikidata_id: string | null
  youtube_id: string | null
}

export type PosterImage = {
  aspect_ratio: number
  file_path: string
  height: number
  iso_639_1: string | null
  vote_average: number
  vote_count: number
  width: number
}

export type PosterImages = {
  id: number
  posters: PosterImage[]
}

export type BackdropImage = PosterImage

export type BackdropImages = {
  id: number
  backdrops: BackdropImage[]
}

export type ProfileImage = {
  file_path: string
  height: number
  wikidata_id: string | null
  width: number
}

export type ProfileImages = {
  id: number
  profiles: ProfileImage[]
}

export type StillImage = PosterImage

export type StillImages = {
  id: number
  stills: StillImage[]
}

export type ImageLanguages = {
  en?: string | null
  [language: string]: string | null | undefined
}

export type Video = {
  id: string
  iso_639_1: string
  iso_3166_1: string
  key: string
  name: string
  official: boolean
  published_at: string
  site: 'YouTube' | 'Vimeo'
  size: number
  type:
    | 'Trailer'
    | 'Teaser'
    | 'Clip'
    | 'Featurette'
    | 'Behind the Scenes'
    | 'Bloopers'
    | 'Opening Credits'
    | 'Recap'
}

export type VideoList = {
  id: number
  results: Video[]
}

export type Review = {
  id: string
  author: string
  author_details: {
    name: string
    username: string
    avatar_path: string | null
    rating: number | null
  }
  content: string
  created_at: string
  updated_at: string
  url: string
}

export type ReviewList = {
  id: number
  page: number
  results: Review[]
  total_pages: number
  total_results: number
}

export type MonetizationType = 'flatrate' | 'free' | 'ads' | 'rent' | 'buy'

export type WatchProvider = {
  display_priorities: Record<string, number>
  display_priority: number
  logo_path: string
  provider_id: number
  provider_name: string
}

export type WatchProviderRegion = Record<string, WatchProvider[]>

export type WatchProviders = {
  id: number
  results: WatchProviderRegion
}

export type CastMember = {
  id: number
  name: string
  original_name: string
  character: string
  credit_id: string
  gender: number
  order: number
  known_for_department: string
  original_profile_path: string | null
  popularity: number
  profile_path: string | null
}

export type CrewMember = {
  id: number
  name: string
  original_name: string
  credit_id: string
  department: string
  gender: number
  job: string
  known_for_department: string
  original_profile_path: string | null
  popularity: number
  profile_path: string | null
}

export type Credits = {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}

export type MovieListItem = {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  media_type?: 'movie' | 'tv'
  genre_ids: number[]
  release_date: string
  original_language: string
  adult: boolean
  popularity: number
  video: boolean
  vote_average: number
  vote_count: number
}

export type TvListItem = {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  media_type?: 'movie' | 'tv'
  genre_ids: number[]
  origin_country: string[]
  original_language: string
  first_air_date: string
  adult: boolean
  popularity: number
  vote_average: number
  vote_count: number
}

export type TitleListItem = MovieListItem | TvListItem

export type PersonListItem = {
  id: number
  name: string
  original_name: string
  media_type?: 'person'
  adult: boolean
  gender: number
  known_for_department: string
  popularity: number
  profile_path: string | null
  known_for: (MovieListItem | TvListItem)[]
}

export type TrendingResult = (MovieListItem | TvListItem | PersonListItem) & {
  media_type: 'movie' | 'tv' | 'person'
}

export type TrendingTitle =
  | (MovieListItem & { media_type: 'movie' })
  | (TvListItem & { media_type: 'tv' })

export type TrendingList = {
  id: number
  page: number
  results: TrendingResult[]
  total_pages: number
  total_results: number
}

export type ProductionCompany = {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export type ProductionCountry = {
  iso_3166_1: string
  name: string
}

export type SpokenLanguage = {
  english_name: string | null
  iso_639_1: string
  name: string
}

export type Cast = {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  roles: { credit_id: string; character: string; order: number }[]
  total_episode_count: number
  order: number
}

export type Crew = {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string | null
  jobs: { credit_id: string; job: string; department: string }[]
  department: string
  total_episode_count: number
}

export type MovieDetail = {
  id: number
  adult: boolean
  backdrop_path: string | null
  belongs_to_collection: {
    id: number
    name: string
    poster_path: string | null
    backdrop_path: string | null
  } | null
  budget: number
  genres: Genre[]
  homepage: string | null
  imdb_id: string | null
  original_language: string
  original_title: string
  overview: string | null
  popularity: number
  poster_path: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  release_date: string
  releases: {
    iso_639_1: string
    release_dates: {
      certification: string
      iso_639_1: string
      note: string
      release_date: number
      type: number
    }[]
  }[]
  revenue: number
  runtime: number | null
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string | null
  title: string
  video: boolean
  vote_average: number
  vote_count: number
  credits?: Credits
  external_ids?: ExternalIds
  images?: BackdropImages & PosterImages & { logos: PosterImage[] }
  recommendations?: Paged<MovieListItem>
  release_dates?: {
    id: number
    results: {
      iso_3166_1: string
      release_dates: {
        certification: string
        iso_639_1: string
        note: string
        release_date: number
        type: number
      }[]
    }[]
  }
  reviews?: ReviewList
  similar?: Paged<MovieListItem>
  videos?: VideoList
  'watch/providers'?: WatchProviders
  media_type?: 'movie' | 'tv'
}

export type Network = {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export type SeasonSummary = {
  id: number
  name: string
  overview: string
  air_date: string | null
  episode_count: number
  poster_path: string | null
  season_number: number
  vote_average: number
}

export type CreatedBy = {
  id: number
  credit_id: string
  name: string
  gender: number
  profile_path: string | null
}

export type NextEpisode = {
  id: number
  air_date: string | null
  episode_number: number
  name: string
  overview: string
  production_code: string
  season_number: number
  show_id: number
  still_path: string | null
  vote_average: number
  vote_count: number
  crew: CrewMember[]
  guest_stars: CastMember[]
  runtime: number | null
}

export type PreviousEpisode = NextEpisode

export type EpisodeListItem = {
  air_date: string | null
  crew: CrewMember[]
  episode_number: number
  guest_stars: CastMember[]
  id: number
  name: string
  overview: string
  popularity: number
  production_code: string
  season_number: number
  show_id: number
  still_path: string | null
  vote_average: number
  vote_count: number
  runtime: number | null
}

export type SeasonDetail = {
  _id: string
  air_date: string | null
  episodes: EpisodeListItem[]
  name: string
  overview: string
  id: number
  poster_path: string | null
  season_number: number
  still_path: string | null
  vote_average: number
  credits?: Credits
  external_ids?: ExternalIds
}

export type ContentRating = {
  results: {
    iso_3166_1: string
    rating: string
    descriptors: string[]
  }[]
}

export type CreatedFor = {
  id: number
  credit_id: string
  name: string
  gender: number
  profile_path: string | null
}

export type NetworkWithLogo = Network & { logo_path: string | null }

export type TvDetail = {
  id: number
  adult: boolean
  backdrop_path: string | null
  created_by: CreatedBy[]
  episode_run_time: number[]
  first_air_date: string
  genres: Genre[]
  homepage: string | null
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: NextEpisode | null
  next_episode_to_air: NextEpisode | null
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string | null
  popularity: number
  poster_path: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  seasons: SeasonSummary[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string | null
  type: string
  vote_average: number
  vote_count: number
  credits?: Credits
  content_ratings?: ContentRating
  external_ids?: ExternalIds
  images?: BackdropImages & PosterImages & { logos: PosterImage[] }
  keywords?: Paged<Keyword>
  recommendations?: Paged<TvListItem>
  reviews?: ReviewList
  similar?: Paged<TvListItem>
  videos?: VideoList
  'watch/providers'?: WatchProviders
  media_type?: 'movie' | 'tv'
}

export type PersonDetail = {
  id: number
  name: string
  original_name: string
  also_known_as: string[]
  biography: string | null
  birthday: string | null
  deathday: string | null
  gender: number
  homepage: string | null
  imdb_id: string | null
  known_for_department: string
  place_of_birth: string | null
  popularity: number
  profile_path: string | null
  adult: boolean
  images?: ProfileImages
  combined_credits?: {
    cast: (MovieListItem & {
      credit_id: string
      character: string
      order: number
      episode_number?: number
      season_number?: number
      media_type: 'movie' | 'tv'
    })[]
    crew: (MovieListItem & {
      credit_id: string
      department: string
      job: string
      episode_number?: number
      season_number?: number
      media_type: 'movie' | 'tv'
    })[]
  }
}

export type CollectionPart = {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  media_type?: 'movie' | 'tv'
  genre_ids: number[]
  original_language: string
  original_title?: string
  original_name?: string
  release_date?: string
  first_air_date?: string
  popularity: number
  vote_average: number
  vote_count: number
  adult: boolean
}

export type CollectionDetail = {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  parts: CollectionPart[]
  images?: BackdropImages & PosterImages
}

export type Account = {
  id: number
  username: string
  name: string | null
  include_adult: boolean
  iso_3166_1: string | null
  iso_639_1: string | null
  avatar: Avatar | null
  object_id?: string
}

export type Avatar = {
  gravatar: { hash: string }
  tmdb: { avatar_path: string | null }
  path: string | null
}

export type AccountStates = {
  id: number
  favorite: boolean
  rated: false | { value: number }
  watchlist: boolean
}

export type AccountMediaList = Paged<MovieListItem | TvListItem> & {
  media_type?: 'movie' | 'tv'
}

export type ListSummary = {
  id: number
  name: string
  description: string
  favorite_count: number
  item_count: number
  iso_639_1: string
  list_type: string
  poster_path: string | null
}

export type ListList = Paged<ListSummary>

export type ListDetail = {
  id: number
  name: string
  description: string
  favorite_count: number
  item_count: number
  iso_639_1: string
  list_type: string
  poster_path: string | null
  results: (MovieListItem | TvListItem)[]
  object_ids?: Record<string, number | string | null>
}

export type RequestToken = {
  success: boolean
  expires_at: string
  request_token: string
}

export type CreateSessionResponse = {
  success: boolean
  session_id: string
}

export type AuthResponse = {
  success: boolean
  status_code: number
  status_message: string
}

export type StatusResponse = {
  id?: number
  success: boolean
  status_code: number
  status_message: string
}

export const MOVIE_SORT_OPTIONS = [
  'popularity.desc',
  'popularity.asc',
  'revenue.desc',
  'revenue.asc',
  'primary_release_date.desc',
  'primary_release_date.asc',
  'title.asc',
  'title.desc',
  'release_date.desc',
  'release_date.asc',
  'vote_average.desc',
  'vote_average.asc',
  'vote_count.desc',
  'vote_count.asc',
] as const

export type MovieSort = (typeof MOVIE_SORT_OPTIONS)[number]

export const TV_SORT_OPTIONS = [
  'popularity.desc',
  'popularity.asc',
  'first_air_date.desc',
  'first_air_date.asc',
  'vote_average.desc',
  'vote_average.asc',
  'vote_count.desc',
  'vote_count.asc',
] as const

export type TvSort = (typeof TV_SORT_OPTIONS)[number]

export const PERSON_SORT_OPTIONS = [
  'popularity.desc',
  'popularity.asc',
  'known_for.desc',
  'known_for.asc',
] as const

export type PersonSort = (typeof PERSON_SORT_OPTIONS)[number]
