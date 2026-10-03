import type { TitleMediaType } from './endpoints'
import type { TitleListItem, TvListItem } from '@/types/tmdb'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

type IsoDate = {
  year: string
  month: number
  day: number
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

function parseIsoDate(value: string): IsoDate | null {
  const match = ISO_DATE.exec(value)
  if (!match) return null
  const month = Number(match[2]) - 1
  if (month < 0 || month > 11) return null
  const day = Number(match[3])
  if (day < 1 || day > 31) return null
  return { year: match[1], month, day }
}

export function isTvTitle(item: TitleListItem): item is TvListItem {
  return 'name' in item
}

export function titleOf(item: TitleListItem): string {
  return isTvTitle(item) ? item.name : item.title
}

export function mediaTypeOf(item: TitleListItem): TitleMediaType {
  return isTvTitle(item) ? 'tv' : 'movie'
}

export function titlePath(
  item: TitleListItem,
  mediaType: TitleMediaType,
): string {
  return mediaType === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`
}

export function releaseDateOf(item: TitleListItem): string {
  return isTvTitle(item) ? item.first_air_date : item.release_date
}

export function yearOf(item: TitleListItem): string | null {
  const date = releaseDateOf(item)
  return ISO_DATE.test(date) ? date.slice(0, 4) : null
}

export function releaseLineOf(item: TitleListItem): string | null {
  return releaseLine(releaseDateOf(item), isTvTitle(item))
}

/**
 * Shared by list items and detail payloads: a detail response carries
 * `first_air_date` or `release_date` directly and never both.
 */
export function releaseLine(date: string, isTv: boolean): string | null {
  const formatted = formatDayMonthYear(date)
  if (formatted === null) return null
  return `${isTv ? 'First aired' : 'Released'} ${formatted}`
}

export function hasScore(item: {
  vote_average: number
  vote_count: number
}): boolean {
  return item.vote_count > 0 && item.vote_average > 0
}

export function formatVoteCount(count: number): string {
  return new Intl.NumberFormat('en-US').format(count)
}

export function formatRuntime(
  minutes: number | null | undefined,
): string | null {
  if (minutes === null || minutes === undefined || minutes <= 0) return null
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest}m`
  if (rest === 0) return `${hours}h`
  return `${hours}h ${rest}m`
}

export function languageLabel(code: string | null | undefined): string | null {
  if (!code) return null
  return code.toUpperCase()
}

/** `2015-06-09T07:21:30Z` and `2015-06-09` both reduce to a day a reader can read. */
export function formatDayMonthYear(value: string | null): string | null {
  if (value === null) return null
  const date = value.slice(0, 10)
  const parsed = parseIsoDate(date)
  if (!parsed) return null
  return `${parsed.day} ${MONTHS[parsed.month]} ${parsed.year}`
}

/**
 * TMDB reports money in whole dollars. Zero means the figure was never recorded
 * rather than that the film cost nothing, so an unrecorded budget is no fact.
 */
export function formatMoney(amount: number): string | null {
  if (amount <= 0) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
}

/** ISO 3166-1 codes are all the API gives, so the code is what can be shown. */
export function formatCountryCodes(
  codes: readonly string[] | null | undefined,
): string | null {
  if (!codes || codes.length === 0) return null
  return [...new Set(codes)].join(' · ')
}

/**
 * TMDB's own enum strings are already sentence-cased except the first letter
 * (`known_for_department` arrives as `Acting`, `status` as `Returning Series`),
 * so only the opening letter needs work for prose.
 */
export function titleCase(value: string): string {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase())
}
