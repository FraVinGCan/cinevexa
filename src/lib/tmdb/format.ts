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
  const parsed = parseIsoDate(releaseDateOf(item))
  if (!parsed) return null
  const verb = isTvTitle(item) ? 'First aired' : 'Released'
  return `${verb} ${parsed.day} ${MONTHS[parsed.month]} ${parsed.year}`
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
