import { Skeleton } from '@/components/ui/skeleton'

export function MediaHeroSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="overflow-hidden rounded-4xl bg-card shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10">
      <span className="sr-only">Loading the featured title</span>
      <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <Skeleton className="aspect-16/9 w-full rounded-none md:aspect-auto md:h-full" />
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <Skeleton className="h-3 w-32 rounded-lg" />
          <Skeleton className="h-8 w-4/5 rounded-xl sm:h-10" />
          <Skeleton className="h-5 w-16 rounded-3xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-full rounded-lg" />
            <Skeleton className="h-3.5 w-full rounded-lg" />
            <Skeleton className="h-3.5 w-2/3 rounded-lg" />
          </div>
          <Skeleton className="mt-auto h-10 w-36 rounded-4xl" />
        </div>
      </div>
    </div>
  )
}
