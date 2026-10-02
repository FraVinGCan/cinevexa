import { MediaCardSkeleton } from './media-card-skeleton'
import { MediaGrid } from '@/components/media/media-grid'

type MediaGridSkeletonProps = {
  count?: number
  className?: string
}

export function MediaGridSkeleton({
  count = 8,
  className,
}: MediaGridSkeletonProps) {
  return (
    <div aria-busy="true" aria-live="polite" className={className}>
      <span className="sr-only">Loading titles</span>
      <MediaGrid>
        {Array.from({ length: count }, (_, index) => (
          <MediaCardSkeleton key={index} />
        ))}
      </MediaGrid>
    </div>
  )
}
