import { MediaCardSkeleton } from './media-card-skeleton'
import { MediaRail } from '@/components/media/media-rail'

type MediaRailSkeletonProps = {
  count?: number
  cardClassName?: string
}

export function MediaRailSkeleton({
  count = 8,
  cardClassName,
}: MediaRailSkeletonProps) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading titles</span>
      <MediaRail busy label="Loading channel">
        {Array.from({ length: count }, (_, index) => (
          <MediaCardSkeleton key={index} className={cardClassName} />
        ))}
      </MediaRail>
    </div>
  )
}
