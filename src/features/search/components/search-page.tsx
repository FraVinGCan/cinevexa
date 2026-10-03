import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router'
import { useCallback, useEffect, useMemo } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'
import { EmptyState } from '@/components/feedback/empty-state'
import { NumberedPagination } from '@/components/pagination/numbered-pagination'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { usePreferencesStore } from '@/features/preferences/preferences.store'
import { useDebouncedInput } from '@/lib/hooks/useDebouncedInput'
import { isTmdbError } from '@/lib/tmdb/errors'
import type {
  Paged,
  PersonListItem,
  TitleListItem,
  TvListItem,
} from '@/types/tmdb'
import {
  MAX_SEARCH_PAGE,
  searchHref,
  searchOptions,
  searchResultCountLabel,
} from '../search'
import {
  SEARCH_QUERY_MAX,
  SEARCH_TAB_LABELS,
  isSearchableQuery,
  parseSearchState,
} from '../search.schema'
import { SearchPanel, type SearchPanelProps } from './search-results'
import { SearchTypeTabs } from './search-tabs'

type ActiveQueries = {
  movie: UseQueryResult<Paged<TitleListItem>, Error>
  tv: UseQueryResult<Paged<TvListItem>, Error>
  person: UseQueryResult<Paged<PersonListItem>, Error>
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const region = usePreferencesStore((state) => state.region)
  const language = usePreferencesStore((state) => state.language)
  const includeAdult = usePreferencesStore((state) => state.includeAdult)

  const state = useMemo(() => parseSearchState(searchParams), [searchParams])

  const commitQuery = useCallback(
    (query: string) => {
      const next = new URLSearchParams(searchParams)
      if (query === '') next.delete('q')
      else next.set('q', query)
      next.delete('page')
      setSearchParams(next, { replace: true, preventScrollReset: true })
    },
    [searchParams, setSearchParams],
  )

  const field = useDebouncedInput({ value: state.query, onCommit: commitQuery })

  const preferences = { region, language, includeAdult }
  const request = {
    query: state.query,
    page: state.page,
    activeTab: state.tab,
  }

  const movieQuery = useQuery(searchOptions('movie', request, preferences))
  const tvQuery = useQuery(searchOptions('tv', request, preferences))
  const personQuery = useQuery(searchOptions('person', request, preferences))

  const searchable = isSearchableQuery(state.query)
  const active =
    state.tab === 'person'
      ? personQuery
      : state.tab === 'tv'
        ? tvQuery
        : movieQuery

  const totalPages = Math.min(active.data?.total_pages ?? 0, MAX_SEARCH_PAGE)
  const correctedPage = correctSearchPage({
    page: state.page,
    totalPages,
    settled: active.isSuccess,
    error: active.error,
  })

  useEffect(() => {
    if (correctedPage === state.page) return
    const next = new URLSearchParams(searchParams)
    if (correctedPage <= 1) next.delete('page')
    else next.set('page', String(correctedPage))
    setSearchParams(next, { replace: true, preventScrollReset: true })
  }, [correctedPage, searchParams, setSearchParams, state])

  const panel = buildPanel(
    state,
    {
      movie: movieQuery,
      tv: tvQuery,
      person: personQuery,
    },
    correctedPage !== state.page,
  )

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs tracking-[0.2em] text-primary uppercase">
              Search
            </p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              {searchable ? `“${state.query.trim()}”` : 'Search the index'}
            </h1>
          </div>
          {searchable && <SearchTypeTabs state={state} />}
        </div>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            commitQuery(field.value)
          }}>
          <InputGroup className="h-11">
            <InputGroupAddon align="inline-start">
              <SearchIcon aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              value={field.value}
              onChange={(event) => field.setValue(event.target.value)}
              maxLength={SEARCH_QUERY_MAX}
              autoComplete="off"
              autoFocus
              aria-label="Search films, series, and people"
              placeholder="Films, series, and people"
            />
            <InputGroupAddon align="inline-end">
              {field.value !== '' && (
                <InputGroupButton
                  size="icon-sm"
                  aria-label="Clear search"
                  onClick={() => commitQuery('')}>
                  <XIcon />
                </InputGroupButton>
              )}
            </InputGroupAddon>
          </InputGroup>
        </form>
      </header>

      {panel === null ? (
        <PromptForAQuery />
      ) : (
        <>
          <ResultCountLine
            isPending={active.isPending}
            isError={active.isError}
            total={active.data?.total_results ?? 0}
            tab={state.tab}
          />
          <SearchPanel {...panel} />
          <NumberedPagination
            page={state.page}
            totalPages={totalPages}
            buildHref={(page) => searchHref({ ...state, page })}
          />
        </>
      )}
    </div>
  )
}

type PageCorrection = {
  page: number
  totalPages: number
  settled: boolean
  error: unknown
}

/**
 * TMDB rejects a page past the end of a result set instead of answering it with
 * an empty one, so an impossible page never yields the total that would correct
 * it. Both shapes are repaired in the address rather than shown as a failure:
 * a rejected search request can only be the page number, since the query and the
 * channel are the only other things the reader controls, and a settled response
 * reporting no pages means the answer begins at the first.
 */
function correctSearchPage({
  page,
  totalPages,
  settled,
  error,
}: PageCorrection): number {
  if (page <= 1) return 1
  if (isTmdbError(error) && error.kind === 'parameters') return 1
  if (totalPages > 0) return Math.min(page, totalPages)
  return settled ? 1 : page
}

/**
 * `settling` covers the frame between an impossible page being rejected and the
 * address being corrected: the skeleton is the honest thing to show there,
 * because the reader asked for something reachable and is about to get it.
 */
function buildPanel(
  state: ReturnType<typeof parseSearchState>,
  queries: ActiveQueries,
  settling: boolean,
): SearchPanelProps | null {
  if (!isSearchableQuery(state.query)) return null
  const base = { query: state.query }
  if (state.tab === 'person') {
    const query = queries.person
    return {
      tab: 'person',
      ...base,
      data: query.data,
      error: query.error,
      isPending: query.isPending || settling,
      isFetching: query.isFetching,
      onRetry: () => query.refetch(),
    }
  }
  if (state.tab === 'tv') {
    const query = queries.tv
    return {
      tab: 'tv',
      ...base,
      data: query.data,
      error: query.error,
      isPending: query.isPending || settling,
      isFetching: query.isFetching,
      onRetry: () => query.refetch(),
    }
  }
  const query = queries.movie
  return {
    tab: 'movie',
    ...base,
    data: query.data,
    error: query.error,
    isPending: query.isPending || settling,
    isFetching: query.isFetching,
    onRetry: () => query.refetch(),
  }
}

type ResultCountLineProps = {
  isPending: boolean
  isError: boolean
  total: number
  tab: keyof typeof SEARCH_TAB_LABELS
}

function ResultCountLine({
  isPending,
  isError,
  total,
  tab,
}: ResultCountLineProps) {
  const label = isPending
    ? `Searching ${SEARCH_TAB_LABELS[tab].toLowerCase()}`
    : isError
      ? 'The search did not complete'
      : searchResultCountLabel(total, tab)
  return <p className="text-sm text-muted-foreground">{label}</p>
}

function PromptForAQuery() {
  return (
    <EmptyState
      icon={SearchIcon}
      title="Nothing asked yet"
      description="Search across every film, series, and person TMDB catalogues, then narrow the answer to one channel or page through it."
      className="border-dashed">
      <Button nativeButton={false} render={<Link to="/discover/movies" />}>
        Browse films
      </Button>
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link to="/discover/tv" />}>
        Browse series
      </Button>
    </EmptyState>
  )
}
