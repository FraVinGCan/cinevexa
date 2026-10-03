const TMDB_ID = /^[1-9]\d*$/
const SEASON_NUMBER = /^\d{1,3}$/

/**
 * A path segment is only an id when it is one. `TMDBError` status 34 covers a
 * number TMDB does not know, but a hand-edited `/movie/abc` would otherwise be
 * sent as a request that cannot mean anything.
 */
export function parseTmdbId(value: string | undefined): number | null {
  if (value === undefined || !TMDB_ID.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) ? id : null
}

/** Season 0 is TMDB's specials season, so zero is a real number here. */
export function parseSeasonNumber(value: string | undefined): number | null {
  if (value === undefined || !SEASON_NUMBER.test(value)) return null
  const season = Number(value)
  return season >= 0 ? season : null
}
