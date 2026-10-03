import { cn } from 'cn'
import { Skeleton } from '@/components/ui/skeleton'

type PersonRowSkeletonProps = {
  className?: string
}

/** Mirrors the box of a person result row: thumb on the left, two lines beside. */
export function PersonRowSkeleton({ className }: PersonRowSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex items-center gap-4 rounded-4xl bg-card p-3 shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10',
        className,
      )}>
      <Skeleton className="aspect-2/3 w-14 shrink-0 rounded-xl" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-1/2 rounded-lg" />
        <Skeleton className="h-3 w-2/3 rounded-lg" />
      </div>
    </div>
  )
}
