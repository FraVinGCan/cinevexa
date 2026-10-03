import { Button } from '@/components/ui/button'
import {
  providerSummaryLine,
  uniqueProviderCount,
  type ProviderGroup,
} from '@/features/catalog/watch-providers'
import { logoUrl } from '@/lib/tmdb/image'
import type { WatchProvider } from '@/types/tmdb'

type ProviderStripProps = {
  groups: readonly ProviderGroup[]
  regionLabel: string
  onOpenAll: () => void
}

/**
 * Availability read off the cell rather than hidden in a dialog: the marks sit
 * under the score, and the caption states which kinds of access exist in the
 * reader's market. The action behind them is only the full list.
 */
export function ProviderStrip({
  groups,
  regionLabel,
  onOpenAll,
}: ProviderStripProps) {
  if (groups.length === 0) return null

  const caption = providerSummaryLine(groups)
  const total = uniqueProviderCount(groups)
  const marks = uniqueProviders(groups).slice(0, 6)

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        {marks.map((provider) => {
          const src = logoUrl(provider.logo_path)
          if (src === null) return null
          return (
            <img
              key={provider.provider_id}
              src={src}
              alt={provider.provider_name}
              width={154}
              height={40}
              loading="lazy"
              decoding="async"
              className="h-7 w-auto rounded-lg bg-surface-raised object-contain p-1"
            />
          )
        })}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenAll}
          className="h-7 min-h-11 px-2 text-xs sm:min-h-0">
          All {total}
        </Button>
      </div>
      {caption !== null && (
        <p className="text-xs text-muted-foreground">
          {caption} in {regionLabel}
        </p>
      )}
    </div>
  )
}

/** A service that both streams and rents is one mark, not two. */
function uniqueProviders(groups: readonly ProviderGroup[]): WatchProvider[] {
  const seen = new Map<number, WatchProvider>()
  for (const group of groups) {
    for (const provider of group.providers) {
      if (!seen.has(provider.provider_id))
        seen.set(provider.provider_id, provider)
    }
  }
  return [...seen.values()]
}
