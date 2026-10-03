import type { TitleMediaType } from '@/lib/tmdb/endpoints'
import {
  formatRuntime,
  hasScore,
  languageLabel,
  releaseLine,
  titleCase,
} from '@/lib/tmdb/format'
import type {
  Credits,
  Genre,
  MovieDetail,
  SeasonSummary,
  TvDetail,
  Video,
} from '@/types/tmdb'

/**
 * The one shape a movie and a series are both described in, so the detail
 * sections are written once. It carries only what those sections read; the pages
 * that build it reach into their own payload for everything else.
 */
export type DetailTitle = {
  mediaType: TitleMediaType
  id: number
  to: string
  title: string
  tagline: string | null
  overview: string | null
  posterPath: string | null
  backdropPath: string | null
  releaseLine: string | null
  releaseDate: string
  runtime: string | null
  language: string | null
  /** The rating for the reader's own market, absent where TMDB rates none. */
  certification: string | null
  score: { value: number; count: number } | null
  genres: Genre[]
  status: string | null
}

export type DetailSource = MovieDetail | TvDetail

/**
 * A film is dated by `release_date` and a series by `first_air_date`, and TMDB
 * never sends both, so the date field is what tells the two apart.
 */
function isMovieDetail(detail: DetailSource): detail is MovieDetail {
  return 'release_date' in detail
}

function isTvDetail(detail: DetailSource): detail is TvDetail {
  return 'first_air_date' in detail
}

export function detailTitleOf(detail: DetailSource): DetailTitle {
  const isTv = isTvDetail(detail)
  const releaseDate = isTv
    ? detail.first_air_date
    : (detail as MovieDetail).release_date
  return {
    mediaType: isTv ? 'tv' : 'movie',
    id: detail.id,
    to: isTv ? `/tv/${detail.id}` : `/movie/${detail.id}`,
    title: isTv ? detail.name : (detail as MovieDetail).title,
    tagline: detail.tagline,
    overview: detail.overview,
    posterPath: detail.poster_path,
    backdropPath: detail.backdrop_path,
    releaseLine: releaseLine(releaseDate, isTv),
    releaseDate,
    runtime: formatRuntime(
      isTv
        ? (detail.episode_run_time[0] ?? null)
        : (detail as MovieDetail).runtime,
    ),
    language: languageLabel(detail.original_language),
    certification: null,
    score: hasScore(detail)
      ? { value: detail.vote_average, count: detail.vote_count }
      : null,
    genres: detail.genres,
    status: detail.status === '' ? null : titleCase(detail.status),
  }
}

/**
 * Certifications and content ratings are published per market, so the rating a
 * reader can act on is the one for the market they selected. A title with no
 * rating in that market has none to show, which is an absence and not a fault.
 */
export function certificationFor(
  detail: DetailSource,
  country: string,
): string | null {
  const code = country.toUpperCase()
  if (isMovieDetail(detail)) {
    const releases = detail.release_dates?.results.find(
      (entry) => entry.iso_3166_1 === code,
    )
    const rated = releases?.release_dates.find(
      (entry) => entry.certification !== '',
    )
    return rated?.certification ?? null
  }
  const rating = detail.content_ratings?.results.find(
    (entry) => entry.iso_3166_1 === code,
  )
  return rating !== undefined && rating.rating !== '' ? rating.rating : null
}

const TRAILER_PRIORITY: readonly Video['type'][] = [
  'Trailer',
  'Teaser',
  'Clip',
  'Featurette',
  'Behind the Scenes',
  'Opening Credits',
  'Bloopers',
  'Recap',
]

/**
 * An official trailer on YouTube is the one video worth promoting; TMDB orders
 * videos by nothing useful, so the choice is made here rather than taken from the
 * first result.
 */
export function leadVideoOf(videos: Video[] | undefined): Video | null {
  if (videos === undefined || videos.length === 0) return null
  const playable = videos.filter(
    (video) => video.site === 'YouTube' && video.key !== '',
  )
  if (playable.length === 0) return null
  const official = playable.filter((video) => video.official)
  const pool = official.length > 0 ? official : playable
  for (const type of TRAILER_PRIORITY) {
    const match = pool.find((video) => video.type === type)
    if (match !== undefined) return match
  }
  return pool[0] ?? null
}

/** Videos worth showing in the gallery: everything TMDB publishes for a title. */
export function galleryVideosOf(videos: Video[] | undefined): Video[] {
  if (videos === undefined) return []
  return videos.filter((video) => video.site === 'YouTube' && video.key !== '')
}

export function videoWatchUrl(video: Video): string {
  return `https://www.youtube.com/watch?v=${video.key}`
}

export function videoEmbedUrl(video: Video): string {
  return `https://www.youtube-nocookie.com/embed/${video.key}?rel=0`
}

export type ExternalLink = {
  label: string
  href: string
}

const IMDB_TITLE_URL = 'https://www.imdb.com/title'

/**
 * Only the ids TMDB actually returned become links. A social handle the title
 * never had is not rendered as an empty destination.
 */
export function externalLinksOf(
  detail: DetailSource,
  externalIds: DetailSource['external_ids'],
): ExternalLink[] {
  const links: ExternalLink[] = []
  const imdbId =
    externalIds?.imdb_id ?? (isTvDetail(detail) ? null : detail.imdb_id)
  if (imdbId !== null && imdbId !== undefined && imdbId !== '') {
    links.push({ label: 'IMDb', href: `${IMDB_TITLE_URL}/${imdbId}/` })
  }
  if (detail.homepage !== null && detail.homepage !== '') {
    links.push({ label: 'Official site', href: detail.homepage })
  }
  if (externalIds?.wikidata_id) {
    links.push({
      label: 'Wikidata',
      href: `https://www.wikidata.org/wiki/${externalIds.wikidata_id}`,
    })
  }
  if (externalIds?.facebook_id) {
    links.push({
      label: 'Facebook',
      href: `https://www.facebook.com/${externalIds.facebook_id}`,
    })
  }
  if (externalIds?.instagram_id) {
    links.push({
      label: 'Instagram',
      href: `https://www.instagram.com/${externalIds.instagram_id}`,
    })
  }
  if (externalIds?.twitter_id) {
    links.push({
      label: 'X',
      href: `https://x.com/${externalIds.twitter_id}`,
    })
  }
  if (externalIds?.youtube_id) {
    links.push({
      label: 'YouTube',
      href: `https://www.youtube.com/channel/${externalIds.youtube_id}`,
    })
  }
  return links
}

/** TMDB orders credits by billing, and cast order is the only order it sends. */
export function castOf(credits: Credits | undefined) {
  if (credits === undefined) return []
  return [...credits.cast].sort((a, b) => a.order - b.order)
}

export function crewOf(credits: Credits | undefined) {
  if (credits === undefined) return []
  return credits.crew
}

export type CrewDepartment = {
  department: string
  jobs: { id: number; name: string; job: string }[]
}

/** Grouped by department because that is how a reader looks for a name. */
export function crewByDepartment(
  credits: Credits | undefined,
): CrewDepartment[] {
  const grouped = new Map<string, Map<string, { id: number; name: string }>>()
  for (const member of credits?.crew ?? []) {
    const jobs = grouped.get(member.department) ?? new Map()
    if (!jobs.has(member.job)) {
      jobs.set(member.job, { id: member.id, name: member.name })
    }
    grouped.set(member.department, jobs)
  }
  return [...grouped.entries()]
    .map(([department, jobs]) => ({
      department: titleCase(department),
      jobs: [...jobs.entries()].map(([job, member]) => ({
        ...member,
        job,
      })),
    }))
    .sort((a, b) => a.department.localeCompare(b.department))
}

export function seasonLabel(season: SeasonSummary): string {
  return season.season_number === 0
    ? season.name
    : `Season ${season.season_number}`
}
