import type { ReactNode } from 'react'
import { cn } from 'cn'

type DetailSectionProps = {
  /** The shelf this section is drawn from, never the heading beneath it. */
  label: string
  heading: string
  action?: ReactNode
  className?: string
  children: ReactNode
}

export function DetailSection({
  label,
  heading,
  action,
  className,
  children,
}: DetailSectionProps) {
  return (
    <section className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {label}
          </p>
          <h2 className="font-heading text-lg font-medium tracking-tight text-balance">
            {heading}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
