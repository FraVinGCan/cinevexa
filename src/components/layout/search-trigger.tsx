import { SearchIcon } from 'lucide-react'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/features/ui/ui.store'

/**
 * Windows and macOS bind the same gesture to different keys, and a palette that
 * advertises the wrong one sends the reader looking for a shortcut that is not
 * there.
 */
function shortcutLabel(): string {
  const agent =
    typeof navigator === 'undefined'
      ? ''
      : `${navigator.userAgent} ${navigator.platform ?? ''}`
  return /mac|iphone|ipad|ipod/i.test(agent) ? '⌘K' : 'Ctrl K'
}

type SearchTriggerProps = {
  className?: string
}

/** The header's row of physical switches opens search, matching ⌘K or `/`. */
export function SearchTrigger({ className }: SearchTriggerProps) {
  const setOpen = useUiStore((state) => state.setSearchOpen)
  const shortcut = shortcutLabel()

  return (
    <Button
      variant="ghost"
      className={cn('min-h-11 min-w-11 gap-2 justify-start', className)}
      onClick={() => setOpen(true)}
      aria-label={`Search the index (${shortcut})`}>
      <SearchIcon aria-hidden />
      <span className="hidden lg:inline">Search</span>
      <kbd
        aria-hidden
        className="hidden rounded-3xl bg-muted-foreground/10 px-1.5 text-xs tracking-normal text-muted-foreground xl:inline">
        {shortcut}
      </kbd>
    </Button>
  )
}
