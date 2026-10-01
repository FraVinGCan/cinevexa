import { Link, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'

export function Component() {
  const { pathname } = useLocation()

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs tracking-[0.2em] text-primary uppercase">
          Unaddressed cell
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Nothing in the index answers to this address.
        </h1>
        <p className="text-base/relaxed text-muted-foreground">
          TMDB keeps titles that have been removed or renamed, and Cinevexa only
          shows what TMDB can still serve. Check the address, or start from the
          index.
        </p>
        <p className="font-mono text-sm break-all text-muted-foreground">
          {pathname}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button render={<Link to="/" />}>Back to the index</Button>
        <Button variant="outline" render={<Link to="/discover/movies" />}>
          Browse movies
        </Button>
        <Button variant="outline" render={<Link to="/discover/tv" />}>
          Browse TV
        </Button>
      </div>
    </div>
  )
}
