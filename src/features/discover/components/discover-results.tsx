import { SearchXIcon } from 'lucide-react'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { MediaGridSkeleton } from '@/components/feedback/media-grid-skeleton'
import { MediaGrid } from '@/components/media/media-grid'
import { PosterCard } from '@/components/media/poster-card'
import { Button } from '@/components/ui/button'
import { mediaTypeOf } from '@/lib/tmdb/format'
import { DISCOVER_PAGE_SIZE } from '@/features/discover/discover'
import type { Paged, TitleListItem } from '@/types/tmdb'

const NO_TITLES: TitleListItem[] = []

type DiscoverResultsProps = {
  data: Paged<TitleListItem> | undefined
  error: unknown
  isPending: boolean
  isFetching: boolean
  onRetry: () => void
  /** An out-of-range page still has to explain itself rather than look empty. */
  hasFilters: boolean
  onClearAll: () => void
}

export function DiscoverResults({
  data,
  error,
  isPending,
  isFetching,
  onRetry,
  hasFilters,
  onClearAll,
}: DiscoverResultsProps) {
  if (isPending) return <MediaGridSkeleton count={DISCOVER_PAGE_SIZE} />
  if (error) return <ErrorState error={error} onRetry={onRetry} />

  const titles = data?.results ?? NO_TITLES
  if (titles.length === 0) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title="Nothing matches this combination"
        description={
          hasFilters
            ? 'TMDB has no titles that satisfy every filter at once. Loosen one, or clear them all.'
            : 'TMDB has nothing on this channel right now. Check back in a moment.'
        }
        className="border-dashed">
        {hasFilters && (
          <Button render={<button type="button" onClick={onClearAll} />}>
            Clear all filters
          </Button>
        )}
      </EmptyState>
    )
  }

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
