import {
  MONETIZATION_OPTIONS,
  RELEASE_TYPE_OPTIONS,
  TV_STATUS_OPTIONS,
  TV_TYPE_OPTIONS,
  languageLabel,
  labelForOption,
  sortLabel,
  type DiscoverFilters,
  type DiscoverMediaType,
} from '@/features/discover/discover.schema'
import {
  serializeValues,
  type DiscoverPatch,
} from '@/features/discover/discover'

export type ActiveChip = {
  id: string
  label: string
  patch: DiscoverPatch
}

function yearLabel(from: number | null, to: number | null): string | null {
  if (from === null && to === null) return null
  if (from === null) return `Up to ${to}`
  if (to === null) return `From ${from}`
  return `${from} – ${to}`
}

function runtimeLabel(from: number | null, to: number | null): string | null {
  if (from === null && to === null) return null
  if (from === null) return `Under ${to} min`
  if (to === null) return `${from} min and up`
  return `${from} – ${to} min`
}

/**
 * One chip per removable facet, derived from the same parsed filters the panel
 * renders, so a chip can never describe something the controls do not show.
 * Each chip carries the patch that removes only itself.
 */
export function activeChips(
  filters: DiscoverFilters,
  mediaType: DiscoverMediaType,
  genreName: (id: number) => string,
): ActiveChip[] {
  const chips: ActiveChip[] = []
  const push = (id: string, label: string, patch: DiscoverPatch) =>
    chips.push({ id, label, patch })

  for (const id of filters.genres) {
    push(`genre-${id}`, genreName(id), {
      with_genres: serializeValues(
        filters.genres.filter((entry) => entry !== id),
      ),
    })
  }
  for (const id of filters.withoutGenres) {
    push(`without-genre-${id}`, `Not ${genreName(id)}`, {
      without_genres: serializeValues(
        filters.withoutGenres.filter((entry) => entry !== id),
      ),
    })
  }

  const year = yearLabel(filters.yearFrom, filters.yearTo)
  if (year !== null) push('year', year, { year_gte: null, year_lte: null })

  const runtime = runtimeLabel(filters.runtimeFrom, filters.runtimeTo)
  if (runtime !== null) {
    push('runtime', runtime, { runtime_gte: null, runtime_lte: null })
  }

  if (filters.voteAverageFrom !== null) {
    push('score', `${filters.voteAverageFrom.toFixed(1)}+ score`, {
      vote_average_gte: null,
    })
  }
  if (filters.voteCountFrom !== null) {
    push('votes', `${filters.voteCountFrom}+ votes`, { vote_count_gte: null })
  }
  if (filters.certification !== null) {
    push('certification', filters.certification, {
      with_certification: null,
      certification_country: null,
    })
  }
  for (const type of filters.monetization) {
    push(`money-${type}`, labelForOption(MONETIZATION_OPTIONS, type), {
      with_watch_monetization_types: serializeValues(
        filters.monetization.filter((entry) => entry !== type),
      ),
    })
  }
  const language = languageLabel(filters.originalLanguage)
  if (language !== '') {
    push('language', language, { with_original_language: null })
  }
  for (const type of filters.releaseTypes) {
    push(`release-${type}`, labelForOption(RELEASE_TYPE_OPTIONS, type), {
      with_release_type: serializeValues(
        filters.releaseTypes.filter((entry) => entry !== type),
      ),
    })
  }
  for (const status of filters.statuses) {
    push(`status-${status}`, labelForOption(TV_STATUS_OPTIONS, status), {
      with_status: serializeValues(
        filters.statuses.filter((entry) => entry !== status),
      ),
    })
  }
  for (const type of filters.types) {
    push(`type-${type}`, labelForOption(TV_TYPE_OPTIONS, type), {
      with_type: serializeValues(
        filters.types.filter((entry) => entry !== type),
      ),
    })
  }
  if (filters.sortBy !== null) {
    push('sort', sortLabel(filters.sortBy, mediaType === 'tv'), {
      sort_by: null,
    })
  }
  return chips
}

export function clearAllPatch(): DiscoverPatch {
  return {
    sort_by: null,
    with_genres: null,
    without_genres: null,
    year_gte: null,
    year_lte: null,
    runtime_gte: null,
    runtime_lte: null,
    vote_average_gte: null,
    vote_count_gte: null,
    certification_country: null,
    with_certification: null,
    with_watch_monetization_types: null,
    with_original_language: null,
    with_release_type: null,
    with_status: null,
    with_type: null,
  }
}
