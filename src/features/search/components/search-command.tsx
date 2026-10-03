import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ClapperboardIcon, SearchIcon, TvIcon, UserIcon } from 'lucide-react'
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useUiStore } from '@/features/ui/ui.store'
import { searchHref } from '../search'
import {
  SEARCH_QUERY_MAX,
  SEARCH_TAB_LABELS,
  SEARCH_TABS,
  type SearchTab,
} from '../search.schema'

const TAB_ICONS: Record<SearchTab, typeof ClapperboardIcon> = {
  movie: ClapperboardIcon,
  tv: TvIcon,
  person: UserIcon,
}

const CHANNELS = [
  { label: 'Home', description: 'Today in the index', to: '/' },
  {
    label: 'Films',
    description: 'Browse the film catalogue',
    to: '/discover/movies',
  },
  {
    label: 'Series',
    description: 'Browse the series catalogue',
    to: '/discover/tv',
  },
] as const

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

/** Search is reachable from every route, so the shortcut is bound globally. */
export function SearchCommand() {
  const open = useUiStore((state) => state.searchOpen)
  const setOpen = useUiStore((state) => state.setSearchOpen)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) return
      const isPaletteKey =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      const isSlashKey =
        event.key === '/' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isTypingTarget(event.target)
      if (!isPaletteKey && !isSlashKey) return
      event.preventDefault()
      setOpen(true)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setOpen])

  function run(to: string) {
    setOpen(false)
    setQuery('')
    navigate(to)
  }

  /**
   * Filtering is off because the palette is not a result list: with a query
   * typed, all three scoped searches are offered, and with nothing typed the
   * channels are. cmdk still owns selection and the arrow keys.
   */
  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search the index"
      description="Find a film, a series, or the people behind them."
      className="sm:max-w-lg">
      <Command shouldFilter={false} loop>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          maxLength={SEARCH_QUERY_MAX}
          placeholder="Films, series, and people"
        />
        <CommandList>
          {query.trim() === '' ? (
            <CommandGroup heading="Channels">
              {CHANNELS.map((channel) => (
                <CommandItem
                  key={channel.to}
                  value={`channel:${channel.to}`}
                  onSelect={() => run(channel.to)}>
                  <SearchIcon aria-hidden />
                  <span className="flex flex-col items-start">
                    {channel.label}
                    <span className="text-xs text-muted-foreground">
                      {channel.description}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandGroup heading="Search">
              {SEARCH_TABS.map((tab) => {
                const Icon = TAB_ICONS[tab]
                return (
                  <CommandItem
                    key={tab}
                    value={`search:${tab}`}
                    onSelect={() => run(searchHref({ query, tab, page: 1 }))}>
                    <Icon aria-hidden />
                    {SEARCH_TAB_LABELS[tab]}
                    <span className="ml-auto truncate text-muted-foreground">
                      “{query.trim()}”
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
