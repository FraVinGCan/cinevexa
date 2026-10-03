import type { ReactNode } from 'react'
import { cn } from 'cn'

type DetailPageProps = {
  children: ReactNode
  className?: string
}

/**
 * The measure every detail cell is read at: one column, one rhythm of ten between
 * shelves. A route that is not a single title — a collection or a keyword — uses
 * the same frame so the app's rhythm does not change with the route.
 */
export function DetailPage({ children, className }: DetailPageProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-content flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10',
        className,
      )}>
      {children}
    </div>
  )
}
