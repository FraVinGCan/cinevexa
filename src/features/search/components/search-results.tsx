import { SearchXIcon } from 'lucide-react'
import { Link } from 'react-router'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { MediaGridSkeleton } from '@/components/feedback/media-grid-skeleton'
import { PersonRowSkeleton } from '@/components/feedback/person-row-skeleton'
import { MediaGrid } from '@/components/media/media-grid'
import { PosterCard } from '@/components/media/poster-card'
import { Button } from '@/components/ui/button'
import { mediaTypeOf } from '@/lib/tmdb/format'
import { SEARCH_PAGE_SIZE } from '../search'
import type { Paged, PersonListItem, TitleListItem } from '@/types/tmdb'
import type { SearchTab } from '../search.schema'
import { PersonResultRow } from './person-result-row'

const NO_TITLES: TitleListItem[] = []
const NO_PEOPLE: PersonListItem[] = []

type QueryState<D> = {
  data: Paged<D> | undefined
  error: unknown
  isPending: boolean
  isFetching: boolean
  onRetry: () => void
}

/**
 * One discriminated shape per tab rather than a union of query objects, so the
 * result list is narrowed by the tab that produced it instead of by a cast.
 */
export type SearchPanelProps = {
  tab: SearchTab
  query: string
} & (
  | ({ tab: 'movie' | 'tv' } & QueryState<TitleListItem>)
  | ({ tab: 'person' } & QueryState<PersonListItem>)
)

export function SearchPanel({
  tab,
  query,
  data,
  error,
  isPending,
  isFetching,
  onRetry,
}: SearchPanelProps) {
  const common = { query, error, isPending, onRetry }

  if (tab === 'person') {
    return <PersonResults {...common} data={data} isFetching={isFetching} />
  }
  return <TitleResults {...common} data={data} isFetching={isFetching} />
}

type TitleResultsProps = {
  query: string
  data: Paged<TitleListItem> | undefined
  error: unknown
  isPending: boolean
  isFetching: boolean
  onRetry: () => void
}

function TitleResults({
  query,
  data,
  error,
  isPending,
  isFetching,
  onRetry,
}: TitleResultsProps) {
  if (isPending) return <MediaGridSkeleton count={SEARCH_PAGE_SIZE} />
  if (error) return <ErrorState error={error} onRetry={onRetry} />

  const titles = data?.results ?? NO_TITLES
  if (titles.length === 0) return <NoMatches query={query} />

  return (
    <div
      aria-busy={isFetching}
      aria-live="polite"
      className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
      <MediaGrid>
        {titles.map((item) => (
          <PosterCard key={`${mediaTypeOf(item)}-${item.id}`} item={item} />
        ))}
      </MediaGrid>
    </div>
  )
}

type PersonResultsProps = {
  query: string
  data: Paged<PersonListItem> | undefined
  error: unknown
  isPending: boolean
  isFetching: boolean
  onRetry: () => void
}

function PersonResults({
  query,
  data,
  error,
  isPending,
  isFetching,
  onRetry,
}: PersonResultsProps) {
  if (isPending) return <PersonResultsSkeleton />
  if (error) return <ErrorState error={error} onRetry={onRetry} />

  const people = data?.results ?? NO_PEOPLE
  if (people.length === 0) return <NoMatches query={query} />

  return (
    <div
      aria-busy={isFetching}
      aria-live="polite"
      className={
        isFetching
          ? 'flex flex-col gap-3 opacity-60 transition-opacity'
          : 'flex flex-col gap-3'
      }>
      {people.map((person) => (
        <PersonResultRow key={person.id} person={person} />
      ))}
    </div>
  )
}

function PersonResultsSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-3">
      <span className="sr-only">Loading people</span>
      {Array.from({ length: SEARCH_PAGE_SIZE }, (_, index) => (
        <PersonRowSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * A misspelling is the likeliest reason for an empty page, so the way out is a
 * shorter spelling or a channel to browse instead of a dead end.
 */
function NoMatches({ query }: { query: string }) {
  return (
    <EmptyState
      icon={SearchXIcon}
      title={`Nothing indexed for “${query.trim()}”`}
      description="TMDB has no film, series, or person matching that spelling on this channel. Try fewer words, or browse a channel instead."
      className="border-dashed">
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link to="/discover/movies" />}>
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
