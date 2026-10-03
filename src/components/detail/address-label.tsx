import type { ReactNode } from 'react'
import { cn } from 'cn'

type AddressLabelProps = {
  children: ReactNode
  className?: string
}

/**
 * The cell's address rather than an eyebrow for the heading beneath it: a tracked
 * label preceded by the signal dot, naming the channel and market the cell is
 * read from. A label that only restates the title below it is not an address.
 */
export function AddressLabel({ children, className }: AddressLabelProps) {
  return (
    <p
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-[0.2em] text-muted-foreground uppercase',
        className,
      )}>
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
      {children}
    </p>
  )
}
