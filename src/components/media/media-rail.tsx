import { useId, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRightIcon } from 'lucide-react'
import { cn } from 'cn'
import { Skeleton } from '@/components/ui/skeleton'

type MediaRailProps = {
  label: string
  heading?: string
  to?: string | null
  toLabel?: string
  busy?: boolean
  children: ReactNode
  className?: string
}

export function MediaRail({
  label,
  heading,
  to,
  toLabel = 'See all',
  busy = false,
  children,
  className,
}: MediaRailProps) {
  const headingId = useId()

  return (
    <section
      aria-label={busy ? label : undefined}
      aria-labelledby={busy ? undefined : headingId}
      className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-3">
        {busy ? (
          <Skeleton className="h-3 w-32 rounded-lg" />
        ) : heading ? (
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              {label}
            </p>
            <h2
              id={headingId}
              className="font-heading text-lg font-medium tracking-tight">
              {heading}
            </h2>
          </div>
        ) : (
          <h2
            id={headingId}
            className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {label}
          </h2>
        )}
        {to && !busy && (
          <Link
            to={to}
            className="ml-auto inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
            {toLabel}
            <ArrowRightIcon aria-hidden />
          </Link>
        )}
      </div>
      <div
        role="group"
        aria-label={busy ? undefined : `${label} titles`}
        tabIndex={busy ? -1 : 0}
        className={cn(
          'flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain contain-paint pb-2',
          '[&::-webkit-scrollbar]:h-1.5',
          '[&::-webkit-scrollbar-track]:bg-transparent',
          '[&::-webkit-scrollbar-thumb]:rounded-full',
          '[&::-webkit-scrollbar-thumb]:bg-muted-foreground/35',
          'focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
        )}>
        {children}
      </div>
    </section>
  )
}
