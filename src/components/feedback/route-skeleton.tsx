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
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-2/3 w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-3 w-1/2 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
