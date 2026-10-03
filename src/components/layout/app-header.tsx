import { Link } from 'react-router'
import { primaryNav, usePageTitle } from '@/app/navigation'
import {
  regionLabel,
  usePreferencesStore,
} from '@/features/preferences/preferences.store'
import { MobileNav } from './mobile-nav'
import { NavLinks } from './nav-links'
import { RegionSelect } from './region-select'
import { SearchTrigger } from './search-trigger'
import { ThemeToggle } from './theme-toggle'

export function AppHeader() {
  const pageTitle = usePageTitle()
  const region = usePreferencesStore((state) => state.region)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-sunken/92 backdrop-blur-md">
      <div className="mx-auto flex min-h-14 w-full max-w-content items-center gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-full py-1 pr-1 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
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

        <div className="ml-2 hidden items-center gap-2 lg:flex">
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {pageTitle ?? 'Index'}
          </span>
        </div>

        <nav
          aria-label="Primary"
          className="ml-auto hidden md:flex md:items-center md:gap-1">
          <NavLinks
            items={primaryNav}
            className="gap-0.5"
            linkClassName="h-11"
          />
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <SearchTrigger />
          <span className="sr-only" aria-live="polite">
            Region {regionLabel(region)}
          </span>
          <RegionSelect />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
