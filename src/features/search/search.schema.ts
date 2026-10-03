import { z } from 'zod'

/**
 * TMDB's own search types, used verbatim as URL values so an address copied out
 * of the address bar is the same word the API expects.
 */
export const SEARCH_TABS = ['movie', 'tv', 'person'] as const

export type SearchTab = (typeof SEARCH_TABS)[number]

export const DEFAULT_SEARCH_TAB: SearchTab = 'movie'

export const SEARCH_TAB_LABELS: Record<SearchTab, string> = {
  movie: 'Films',
  tv: 'Series',
  person: 'People',
}

/** Mirrors the `maxLength` on the field, so the URL can never exceed it either. */
export const SEARCH_QUERY_MAX = 100

/** A control character in an address bar is noise; TMDB reads it as a word break. */
function stripControlCharacters(value: string): string {
  let cleaned = ''
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0
    cleaned += code <= 0x1f || code === 0x7f ? ' ' : character
  }
  return cleaned
}

/**
 * The typed text is stored exactly as entered rather than trimmed or collapsed:
 * the field shows what was typed while it is being typed, and rewriting the value
 * under the cursor mid-word is worse than sending TMDB a padded query.
 */
const queryParam = z
  .string()
  .transform(stripControlCharacters)
  .transform((value) => value.slice(0, SEARCH_QUERY_MAX))

const tabParam = z
  .string()
  .optional()
  .transform((value): SearchTab =>
    value === 'tv' || value === 'person' ? value : DEFAULT_SEARCH_TAB,
  )

const pageParam = z.coerce.number().int().min(1).catch(1)

const searchSchema = z.object({
  q: queryParam.catch(''),
  type: tabParam,
  page: pageParam,
})

export type SearchState = {
  query: string
  tab: SearchTab
  page: number
}

export const EMPTY_SEARCH_STATE: SearchState = {
  query: '',
  tab: DEFAULT_SEARCH_TAB,
  page: 1,
}

/**
 * A hand-edited address can only ever produce a validated state: an unknown type
 * falls back to the default tab, a page below one resets to the first, and a
 * query longer than the field allows is cut rather than sent.
 */
export function parseSearchState(search: URLSearchParams): SearchState {
  const parsed = searchSchema.safeParse(Object.fromEntries(search.entries()))
  if (!parsed.success) return EMPTY_SEARCH_STATE
  return {
    query: parsed.data.q,
    tab: parsed.data.type,
    page: parsed.data.page,
  }
}

/** A query of only whitespace is no query at all, and must not reach TMDB. */
export function isSearchableQuery(query: string): boolean {
  return query.trim() !== ''
}
