import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { primaryNav } from '@/app/navigation'
import {
  regionLabel,
  usePreferencesStore,
} from '@/features/preferences/preferences.store'
import { useUiStore } from '@/features/ui/ui.store'
import { NavLinks } from './nav-links'
import { RegionSelect } from './region-select'
import { ThemeToggle } from './theme-toggle'

export function MobileNav() {
  const open = useUiStore((state) => state.mobileNavOpen)
  const setOpen = useUiStore((state) => state.setMobileNavOpen)
  const region = usePreferencesStore((state) => state.region)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="size-11 md:hidden" />
        }
        aria-label="Open navigation">
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Cinevexa index
          </SheetTitle>
          <SheetDescription className="sr-only">
            Primary navigation for Cinevexa, resolving providers against{' '}
            {regionLabel(region)}.
          </SheetDescription>
        </SheetHeader>
        <NavLinks
          items={primaryNav}
          onNavigate={() => setOpen(false)}
          className="flex-col items-stretch gap-1 p-4"
          linkClassName="flex min-h-11 items-center px-3 text-base"
        />
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border p-4">
          <span className="text-xs tracking-[0.12em] text-muted-foreground uppercase">
            Market
          </span>
          <div className="flex items-center gap-1">
            <RegionSelect />
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
