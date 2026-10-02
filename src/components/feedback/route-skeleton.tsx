import { MediaGridSkeleton } from '@/components/feedback/media-grid-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export function RouteSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mx-auto w-full max-w-content px-4 py-10 sm:px-6">
      <span className="sr-only">Loading page</span>
      <Skeleton className="h-8 w-56 rounded-xl" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full rounded-lg" />
      <MediaGridSkeleton className="mt-8" />
    </div>
  )
}
