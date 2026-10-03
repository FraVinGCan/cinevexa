import type { ReactNode } from 'react'
import { cn } from 'cn'
import { Skeleton } from '@/components/ui/skeleton'

type DetailSkeletonProps = {
  /** The label above the loading title: what this cell is reading. */
  address: string
  className?: string
  children?: ReactNode
}

/**
 * The cell's own shape, held while its content lands: artwork left, copy right,
 * then room for the shelves below. Reserving the real layout keeps the page from
 * jumping when the title arrives and makes the wait legible as this route.
 */
export function DetailSkeleton({
  address,
  className,
  children,
}: DetailSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn('flex flex-col gap-10', className)}>
      <span className="sr-only">Loading {address}</span>

      <div className="overflow-hidden rounded-4xl bg-card shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10">
        <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <Skeleton className="aspect-16/9 rounded-none md:aspect-auto md:h-full" />
          <div className="flex flex-col gap-4 p-5 sm:p-6">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-9 w-4/5" />
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-7 w-32 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-40" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </div>

      {children}
    </div>
  )
}
