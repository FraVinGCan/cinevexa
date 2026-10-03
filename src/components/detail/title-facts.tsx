import type { ReactNode } from 'react'
import { cn } from 'cn'

type TitleFactsProps = {
  items: { term: string; description: ReactNode }[]
  className?: string
}

/**
 * A title's fixed attributes as readouts rather than prose. A fact TMDB does not
 * publish for this title is left out instead of being rendered as an empty term.
 */
export function TitleFacts({ items, className }: TitleFactsProps) {
  const rows = items.filter((item) => item.description !== null)
  if (rows.length === 0) return null

  return (
    <dl
      className={cn(
        'grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}>
      {rows.map((item) => (
        <div key={item.term} className="flex min-w-0 flex-col gap-1">
          <dt className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {item.term}
          </dt>
          <dd className="text-sm text-card-foreground">{item.description}</dd>
        </div>
      ))}
    </dl>
  )
}
