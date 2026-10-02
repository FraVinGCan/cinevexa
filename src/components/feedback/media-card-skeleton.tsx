import { cn } from 'cn'
import { Skeleton } from '@/components/ui/skeleton'

type MediaCardSkeletonProps = {
  className?: string
}

export function MediaCardSkeleton({ className }: MediaCardSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex flex-col overflow-hidden rounded-4xl bg-card shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10',
        className,
      )}>
      <Skeleton className="aspect-2/3 w-full shrink-0 rounded-none" />
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex h-[2.75rem] flex-col gap-1.5">
          <Skeleton className="h-4 w-4/5 rounded-lg" />
          <Skeleton className="h-4 w-3/5 rounded-lg" />
        </div>
        <div className="mt-auto flex flex-col items-start gap-1.5 pt-1">
          <Skeleton className="h-5 w-12 rounded-3xl" />
          <Skeleton className="h-3 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
