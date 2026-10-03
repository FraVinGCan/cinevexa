import { XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  clearAllPatch,
  type ActiveChip,
} from '@/features/discover/active-filters'
import type { DiscoverPatch } from '@/features/discover/discover'

type ActiveFilterChipsProps = {
  chips: ActiveChip[]
  onPatch: (patch: DiscoverPatch) => void
  resultCount?: number
}

/**
 * Chips are pressed targets here, so each is a button; the aggregate actions
 * stay plain controls so they do not read as removable facets.
 */
export function ActiveFilterChips({
  chips,
  onPatch,
  resultCount,
}: ActiveFilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Badge key={chip.id} variant="secondary">
          <span>{chip.label}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            nativeButton
            onClick={() => onPatch(chip.patch)}
            className="-mr-1 text-muted-foreground hover:text-foreground">
            <XIcon />
            <span className="sr-only">Remove {chip.label}</span>
          </Button>
        </Badge>
      ))}
      {chips.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          nativeButton
          onClick={() => onPatch(clearAllPatch())}
          className="text-muted-foreground hover:text-foreground">
          Clear all filters
        </Button>
      )}
      {resultCount !== undefined && (
        <span className="ml-auto text-sm text-muted-foreground">
          {resultCount.toLocaleString('en-US')} titles
        </span>
      )}
    </div>
  )
}
