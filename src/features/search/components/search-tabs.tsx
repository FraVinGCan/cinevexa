import { Link } from 'react-router'
import { FilmIcon, TvIcon, UserIcon } from 'lucide-react'
import { cn } from 'cn'
import { searchHref } from '../search'
import {
  SEARCH_TAB_LABELS,
  SEARCH_TABS,
  type SearchState,
  type SearchTab,
} from '../search.schema'

const TAB_ICONS: Record<SearchTab, typeof FilmIcon> = {
  movie: FilmIcon,
  tv: TvIcon,
  person: UserIcon,
}

type SearchTabsProps = {
  state: SearchState
}

/**
 * The result type is part of the address rather than local state, so each tab is
 * a link: it can be shared, opened in a new tab, and stepped back through.
 * Changing type always returns to the first page, because page seven of one
 * channel means nothing on another.
 */
export function SearchTypeTabs({ state }: SearchTabsProps) {
  return (
    <nav aria-label="Result type">
      <ul className="flex gap-1 rounded-3xl bg-muted p-1">
        {SEARCH_TABS.map((tab) => {
          const active = tab === state.tab
          const Icon = TAB_ICONS[tab]
          return (
            <li key={tab}>
              <Link
                to={searchHref({ ...state, tab, page: 1 })}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-11 items-center gap-2 rounded-3xl px-4 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
                  active
                    ? 'bg-card text-card-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}>
                <Icon aria-hidden className="size-4" />
                {SEARCH_TAB_LABELS[tab]}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
