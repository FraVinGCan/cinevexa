import { useState } from 'react'
import { SlidersHorizontalIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { DiscoverFilterPanel } from './filter-panel'
import { clearAllPatch } from '@/features/discover/active-filters'
import type { DiscoverPatch } from '@/features/discover/discover'
import type {
  DiscoverFilters,
  DiscoverMediaType,
} from '@/features/discover/discover.schema'
import type { Genre } from '@/types/tmdb'

type DiscoverFilterShellProps = {
  mediaType: DiscoverMediaType
  filters: DiscoverFilters
  genres: Genre[]
  certifications: readonly string[]
  activeCount: number
  resultCount: number | undefined
  isPending: boolean
  onPatch: (patch: DiscoverPatch) => void
}

function FiltersHeading({
  activeCount,
  onClearAll,
}: {
  activeCount: number
  onClearAll: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-4 pt-4">
      <h2 className="font-heading text-base font-medium">Filters</h2>
      {activeCount > 0 && (
        <Button variant="ghost" size="sm" nativeButton onClick={onClearAll}>
          Clear all
        </Button>
      )}
    </div>
  )
}

/**
 * One control set, two placements. The rail is the desktop address for the same
 * filters the sheet offers below `xl`, and the two copies carry distinct id
 * prefixes so each label stays bound to its own control.
 */
export function DiscoverFilterShell({
  mediaType,
  filters,
  genres,
  certifications,
  activeCount,
  resultCount,
  isPending,
  onPatch,
}: DiscoverFilterShellProps) {
  const [open, setOpen] = useState(false)
  const clearAll = () => onPatch(clearAllPatch())
  const total = resultCount?.toLocaleString('en-US') ?? null

  return (
    <>
      <aside
        aria-label="Filters"
        className="hidden xl:sticky xl:top-20 xl:block xl:self-start">
        <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-4xl border">
          <FiltersHeading activeCount={activeCount} onClearAll={clearAll} />
          <div className="pb-2">
            <DiscoverFilterPanel
              mediaType={mediaType}
              filters={filters}
              genres={genres}
              certifications={certifications}
              idPrefix="rail"
              onPatch={onPatch}
            />
          </div>
        </div>
      </aside>

      <div className="xl:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="outline" className="min-h-11 gap-2" />}>
            <SlidersHorizontalIcon />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary" className="h-5">
                {activeCount}
              </Badge>
            )}
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85dvh] gap-0 p-0">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                {activeCount > 0
                  ? `${activeCount} ${activeCount === 1 ? 'filter' : 'filters'} applied.`
                  : 'Narrow the catalogue, or leave it as TMDB serves it.'}
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <DiscoverFilterPanel
                mediaType={mediaType}
                filters={filters}
                genres={genres}
                certifications={certifications}
                idPrefix="sheet"
                onPatch={onPatch}
              />
            </div>
            <SheetFooter className="flex-row items-center gap-2 border-t">
              {activeCount > 0 && (
                <Button variant="ghost" nativeButton onClick={clearAll}>
                  Clear all
                </Button>
              )}
              <Button
                className="flex-1"
                nativeButton
                onClick={() => setOpen(false)}>
                {isPending
                  ? 'Loading titles'
                  : total
                    ? `Show ${total} titles`
                    : 'Show titles'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
