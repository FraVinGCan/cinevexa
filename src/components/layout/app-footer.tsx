import { Link } from 'react-router'
import { primaryNav } from '@/app/navigation'
import {
  regionLabel,
  usePreferencesStore,
} from '@/features/preferences/preferences.store'
import { NavLinks } from './nav-links'

export function AppFooter() {
  const region = usePreferencesStore((state) => state.region)

  return (
    <footer className="mt-16 border-t border-border bg-surface-sunken">
      <div className="mx-auto grid w-full max-w-content gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
            <img
              src="/favicon.svg"
              alt=""
              width={28}
              height={28}
              className="size-7"
            />
            <span className="font-heading text-base font-semibold tracking-tight">
              Cinevexa
            </span>
          </Link>
          <p className="max-w-sm text-sm/relaxed text-muted-foreground">
            A broadcast index for film and television. Every title is an
            addressed cell carrying its own channel, so you can read a title's
            provider without opening a dialog.
          </p>
        </div>

        <nav aria-label="Footer" className="space-y-3">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Index
          </h2>
          <NavLinks
            items={primaryNav}
            className="grid grid-cols-2 gap-x-4"
            linkClassName="min-h-11 hover:text-primary"
          />
        </nav>

        <div className="space-y-3">
          <h2 className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Market
          </h2>
          <p className="text-sm/relaxed text-muted-foreground">
            Providers and certifications resolve against{' '}
            <span className="font-medium text-foreground">
              {regionLabel(region)}
            </span>
            . Change it from the header at any time.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-content flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB. All catalogue data and artwork are TMDB's.
          </p>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer noopener"
            className="w-fit rounded-sm py-2 font-medium text-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
            themoviedb.org
          </a>
        </div>
      </div>
    </footer>
  )
}
