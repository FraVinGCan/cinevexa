import { z } from 'zod'
import {
  isRegionCode,
  type RegionCode,
} from '@/features/preferences/preferences.store'
import {
  MOVIE_SORT_OPTIONS,
  TV_SORT_OPTIONS,
  type MonetizationType,
  type MovieSort,
  type TvSort,
} from '@/types/tmdb'

export type DiscoverMediaType = 'movie' | 'tv'

export const DISCOVER_SEGMENTS = ['movies', 'tv'] as const

export type DiscoverSegment = (typeof DISCOVER_SEGMENTS)[number]

export function isDiscoverSegment(
  value: string | undefined,
): value is DiscoverSegment {
  return value === 'movies' || value === 'tv'
}

export function discoverSegmentOf(
  mediaType: DiscoverMediaType,
): DiscoverSegment {
  return mediaType === 'tv' ? 'tv' : 'movies'
}

export function discoverMediaTypeOf(
  segment: DiscoverSegment,
): DiscoverMediaType {
  return segment === 'tv' ? 'tv' : 'movie'
}

/** The oldest year TMDB catalogues and two years past this one for releases. */
export const YEAR_MIN = 1888
export const YEAR_MAX = new Date().getFullYear() + 6
export const RUNTIME_MIN = 0
export const RUNTIME_MAX = 400
export const VOTE_AVERAGE_MAX = 10
export const VOTE_COUNT_MAX = 20000
export const VOTE_COUNT_STEP = 100
export const RUNTIME_STEP = 5
export const VOTE_AVERAGE_STEP = 0.1

export const ANY_OPTION = 'any'

export const MONETIZATION_OPTIONS = [
  { value: 'flatrate', label: 'Subscription' },
  { value: 'free', label: 'Free' },
  { value: 'ads', label: 'With ads' },
  { value: 'rent', label: 'Rent' },
  { value: 'buy', label: 'Buy' },
] as const satisfies readonly { value: MonetizationType; label: string }[]

export const RELEASE_TYPE_OPTIONS = [
  { value: 1, label: 'Premiere' },
  { value: 2, label: 'Theatrical, limited' },
  { value: 3, label: 'Theatrical' },
  { value: 4, label: 'Digital' },
  { value: 5, label: 'Physical' },
  { value: 6, label: 'TV' },
] as const

export const TV_STATUS_OPTIONS = [
  { value: 0, label: 'Returning series' },
  { value: 1, label: 'Planned' },
  { value: 2, label: 'In production' },
  { value: 3, label: 'Ended' },
  { value: 4, label: 'Cancelled' },
  { value: 5, label: 'Pilot' },
] as const

export const TV_TYPE_OPTIONS = [
  { value: 0, label: 'Documentary' },
  { value: 1, label: 'News' },
  { value: 2, label: 'Miniseries' },
  { value: 3, label: 'Reality' },
  { value: 4, label: 'Scripted' },
  { value: 5, label: 'Talk show' },
  { value: 6, label: 'Video' },
] as const

/**
 * TMDB publishes no original-language list, the same reason the market selector
 * carries a curated set. These are the languages the catalogue is actually
 * populated in, not a claim to be exhaustive.
 */
export const ORIGINAL_LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: 'Japanese' },
  { code: 'fr', label: 'French' },
  { code: 'ko', label: 'Korean' },
  { code: 'zh', label: 'Chinese' },
  { code: 'es', label: 'Spanish' },
  { code: 'hi', label: 'Hindi' },
  { code: 'de', label: 'German' },
  { code: 'ru', label: 'Russian' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'da', label: 'Danish' },
  { code: 'nl', label: 'Dutch' },
  { code: 'sv', label: 'Swedish' },
  { code: 'no', label: 'Norwegian' },
  { code: 'fi', label: 'Finnish' },
  { code: 'pl', label: 'Polish' },
  { code: 'tr', label: 'Turkish' },
  { code: 'ar', label: 'Arabic' },
  { code: 'he', label: 'Hebrew' },
  { code: 'th', label: 'Thai' },
  { code: 'id', label: 'Indonesian' },
  { code: 'tl', label: 'Filipino' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'cs', label: 'Czech' },
  { code: 'hu', label: 'Hungarian' },
  { code: 'ro', label: 'Romanian' },
  { code: 'el', label: 'Greek' },
  { code: 'fa', label: 'Persian' },
  { code: 'bn', label: 'Bengali' },
] as const

export type OriginalLanguageOption = (typeof ORIGINAL_LANGUAGE_OPTIONS)[number]

const MONETIZATION_VALUES = MONETIZATION_OPTIONS.map((option) => option.value)
const RELEASE_TYPE_VALUES = RELEASE_TYPE_OPTIONS.map((option) => option.value)
const TV_STATUS_VALUES = TV_STATUS_OPTIONS.map((option) => option.value)
const TV_TYPE_VALUES = TV_TYPE_OPTIONS.map((option) => option.value)
const ORIGINAL_LANGUAGE_VALUES = ORIGINAL_LANGUAGE_OPTIONS.map(
  (option) => option.code,
)

/**
 * TMDB returns codes rather than names for release type, status and genre, so
 * every code in a URL is checked against the set the app can label.
 */
const CERTIFICATION_PATTERN = /^[A-Za-z0-9-]{1,8}$/

/**
 * TMDB writes OR-separated lists both ways: commas for genres, pipes for
 * release type, status, type and monetisation. Incoming links may use either,
 * so both are accepted as separators.
 */
function splitEntries(value: string | undefined): string[] {
  if (value === undefined) return []
  return value
    .split(/[,|]/)
    .map((entry) => entry.trim())
    .filter((entry) => entry !== '')
}

function pickMember<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T | null {
  if (value === undefined) return null
  const trimmed = value.trim()
  return (allowed as readonly string[]).includes(trimmed)
    ? (trimmed as T)
    : null
}

function pickNumberList(
  value: string | undefined,
  allowed: readonly number[],
): number[] {
  const permitted = new Set(allowed)
  const picked = new Set<number>()
  for (const entry of splitEntries(value)) {
    const parsed = Number(entry)
    if (Number.isInteger(parsed) && permitted.has(parsed)) picked.add(parsed)
  }
  return [...picked].sort((left, right) => left - right)
}

function pickStringList<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T[] {
  const permitted = new Set<string>(allowed)
  const picked = new Set<T>()
  for (const entry of splitEntries(value)) {
    if (permitted.has(entry)) picked.add(entry as T)
  }
  return [...picked]
}

function pickInteger(
  value: string | undefined,
  min: number,
  max: number,
): number | null {
  if (value === undefined) return null
  const trimmed = value.trim()
  if (trimmed === '') return null
  const parsed = Number(trimmed)
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) return null
  return parsed
}

function pickPositiveIntegerList(value: string | undefined): number[] {
  const picked = new Set<number>()
  for (const entry of splitEntries(value)) {
    const parsed = Number(entry)
    if (Number.isInteger(parsed) && parsed > 0) picked.add(parsed)
  }
  return [...picked].sort((left, right) => left - right)
}

const integerParam = (min: number, max: number) =>
  z
    .string()
    .optional()
    .transform((value) => pickInteger(value, min, max))

const voteAverageParam = z
  .string()
  .optional()
  .transform((value) => {
    if (value === undefined) return null
    const parsed = Number(value.trim())
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > VOTE_AVERAGE_MAX)
      return null
    return Math.round(parsed * 10) / 10
  })

const genreListParam = z.string().optional().transform(pickPositiveIntegerList)

const certificationCountryParam = z
  .string()
  .optional()
  .transform((value) => {
    if (value === undefined) return null
    const trimmed = value.trim().toUpperCase()
    return isRegionCode(trimmed) ? trimmed : null
  })

const certificationParam = z
  .string()
  .optional()
  .transform((value) => {
    if (value === undefined) return null
    const trimmed = value.trim()
    return CERTIFICATION_PATTERN.test(trimmed) ? trimmed : null
  })

const monetizationParam = z
  .string()
  .optional()
  .transform((value) =>
    pickStringList<MonetizationType>(value, MONETIZATION_VALUES),
  )

const originalLanguageParam = z
  .string()
  .optional()
  .transform((value) =>
    pickMember(value, ORIGINAL_LANGUAGE_VALUES as readonly string[]),
  )

const releaseTypeParam = z
  .string()
  .optional()
  .transform((value) => pickNumberList(value, RELEASE_TYPE_VALUES))

const tvStatusParam = z
  .string()
  .optional()
  .transform((value) => pickNumberList(value, TV_STATUS_VALUES))

const tvTypeParam = z
  .string()
  .optional()
  .transform((value) => pickNumberList(value, TV_TYPE_VALUES))

const pageParam = z.coerce.number().int().min(1).catch(1)

const sharedShape = {
  sort_by: z.string().optional(),
  with_genres: genreListParam,
  without_genres: genreListParam,
  year_gte: integerParam(YEAR_MIN, YEAR_MAX),
  year_lte: integerParam(YEAR_MIN, YEAR_MAX),
  runtime_gte: integerParam(RUNTIME_MIN, RUNTIME_MAX),
  runtime_lte: integerParam(RUNTIME_MIN, RUNTIME_MAX),
  vote_average_gte: voteAverageParam,
  vote_count_gte: integerParam(0, VOTE_COUNT_MAX),
  certification_country: certificationCountryParam,
  with_certification: certificationParam,
  with_watch_monetization_types: monetizationParam,
  with_original_language: originalLanguageParam,
}

const movieSearchSchema = z.object({
  ...sharedShape,
  with_release_type: releaseTypeParam,
  page: pageParam,
})

const tvSearchSchema = z.object({
  ...sharedShape,
  with_status: tvStatusParam,
  with_type: tvTypeParam,
  page: pageParam,
})

type SharedSearchShape = {
  sort_by?: string | undefined
  with_genres: number[]
  without_genres: number[]
  year_gte: number | null
  year_lte: number | null
  runtime_gte: number | null
  runtime_lte: number | null
  vote_average_gte: number | null
  vote_count_gte: number | null
  certification_country: RegionCode | null
  with_certification: string | null
  with_watch_monetization_types: MonetizationType[]
  with_original_language: string | null
}

export type DiscoverFilters = {
  sortBy: string | null
  genres: number[]
  withoutGenres: number[]
  yearFrom: number | null
  yearTo: number | null
  runtimeFrom: number | null
  runtimeTo: number | null
  voteAverageFrom: number | null
  voteCountFrom: number | null
  certification: string | null
  certificationCountry: RegionCode | null
  originalLanguage: string | null
  monetization: MonetizationType[]
  releaseTypes: number[]
  statuses: number[]
  types: number[]
}

export type DiscoverSearchState = {
  page: number
  filters: DiscoverFilters
}

export const EMPTY_FILTERS: DiscoverFilters = {
  sortBy: null,
  genres: [],
  withoutGenres: [],
  yearFrom: null,
  yearTo: null,
  runtimeFrom: null,
  runtimeTo: null,
  voteAverageFrom: null,
  voteCountFrom: null,
  certification: null,
  certificationCountry: null,
  originalLanguage: null,
  monetization: [],
  releaseTypes: [],
  statuses: [],
  types: [],
}

function orderRange(
  from: number | null,
  to: number | null,
): { from: number | null; to: number | null } {
  if (from === null || to === null) return { from, to }
  return from <= to ? { from, to } : { from: to, to: from }
}

function sharedFilters(
  raw: SharedSearchShape,
  sortBy: string | null,
): Omit<DiscoverFilters, 'releaseTypes' | 'statuses' | 'types'> {
  const years = orderRange(raw.year_gte, raw.year_lte)
  const runtime = orderRange(raw.runtime_gte, raw.runtime_lte)
  return {
    sortBy,
    genres: raw.with_genres,
    withoutGenres: raw.without_genres,
    yearFrom: years.from,
    yearTo: years.to,
    runtimeFrom: runtime.from,
    runtimeTo: runtime.to,
    voteAverageFrom: raw.vote_average_gte,
    voteCountFrom: raw.vote_count_gte,
    certification: raw.with_certification,
    certificationCountry: raw.certification_country,
    originalLanguage: raw.with_original_language,
    monetization: raw.with_watch_monetization_types,
  }
}

/**
 * A hand-edited URL can only ever produce a validated filter set: unrecognised
 * keys are stripped, unrecognised values inside a known key are dropped, and a
 * range is ordered before it reaches TMDB.
 */
export function parseDiscoverSearch(
  search: URLSearchParams,
  mediaType: DiscoverMediaType,
): DiscoverSearchState {
  const raw: unknown = Object.fromEntries(search.entries())
  if (mediaType === 'tv') {
    const parsed = tvSearchSchema.safeParse(raw)
    if (!parsed.success) return { page: 1, filters: EMPTY_FILTERS }
    return {
      page: parsed.data.page,
      filters: {
        ...sharedFilters(
          parsed.data,
          pickMember(parsed.data.sort_by, TV_SORT_OPTIONS),
        ),
        releaseTypes: [],
        statuses: parsed.data.with_status,
        types: parsed.data.with_type,
      },
    }
  }
  const parsed = movieSearchSchema.safeParse(raw)
  if (!parsed.success) return { page: 1, filters: EMPTY_FILTERS }
  return {
    page: parsed.data.page,
    filters: {
      ...sharedFilters(
        parsed.data,
        pickMember(parsed.data.sort_by, MOVIE_SORT_OPTIONS),
      ),
      releaseTypes: parsed.data.with_release_type,
      statuses: [],
      types: [],
    },
  }
}

/**
 * `sort_by` arrives from the URL as a string, so an unrecognised code is passed
 * through unchanged rather than rejected; the parser has already dropped it.
 */
export function sortLabel(value: string, isTv: boolean): string {
  return isTv
    ? (TV_SORT_LABELS[value as TvSort] ?? value)
    : (MOVIE_SORT_LABELS[value as MovieSort] ?? value)
}

export const MOVIE_SORT_LABELS: Record<MovieSort, string> = {
  'popularity.desc': 'Most popular',
  'popularity.asc': 'Least popular',
  'revenue.desc': 'Highest grossing',
  'revenue.asc': 'Lowest grossing',
  'primary_release_date.desc': 'Newest first',
  'primary_release_date.asc': 'Oldest first',
  'title.asc': 'Title, A to Z',
  'title.desc': 'Title, Z to A',
  'release_date.desc': 'Latest released',
  'release_date.asc': 'Earliest released',
  'vote_average.desc': 'Highest rated',
  'vote_average.asc': 'Lowest rated',
  'vote_count.desc': 'Most rated',
  'vote_count.asc': 'Least rated',
}

export const TV_SORT_LABELS: Record<TvSort, string> = {
  'popularity.desc': 'Most popular',
  'popularity.asc': 'Least popular',
  'first_air_date.desc': 'Newest first',
  'first_air_date.asc': 'Oldest first',
  'vote_average.desc': 'Highest rated',
  'vote_average.asc': 'Lowest rated',
  'vote_count.desc': 'Most rated',
  'vote_count.asc': 'Least rated',
}

export function labelForOption<T extends string | number>(
  options: readonly { value: T; label: string }[],
  value: T,
): string {
  return (
    options.find((option) => option.value === value)?.label ?? String(value)
  )
}

export function languageLabel(code: string | null): string {
  if (code === null) return ''
  return (
    ORIGINAL_LANGUAGE_OPTIONS.find((option) => option.code === code)?.label ??
    code
  )
}

export function toggleMember<T>(list: readonly T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((entry) => entry !== value)
    : [...list, value]
}
