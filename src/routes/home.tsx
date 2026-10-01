import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

export function Component() {
  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs tracking-[0.2em] text-primary uppercase">
          Cinevexa
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          A keyable, page-addressed broadcast index for film and television.
        </h1>
        <p className="text-base/relaxed text-muted-foreground">
          Find films, series, and the people behind them, understand them in
          depth, and decide where to watch in your market.
        </p>
      </div>

      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>The index is not assembled yet</EmptyTitle>
          <EmptyDescription>
            The catalogue reads, the rails, and every detail surface are built
            on top of this shell. Nothing here is placeholder data — there is
            simply nothing indexed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" render={<Link to="/discover/movies" />}>
            Browse movies
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
