import type {
  MonetizationType,
  WatchProvider,
  WatchProviderRegionEntry,
  WatchProviders,
} from '@/types/tmdb'

/**
 * The order a reader decides in: what is included, then free, then what costs
 * money. Grouping by this rather than by TMDB's key order keeps the caption line
 * stable and puts the cheapest answer first.
 */
export const MONETIZATION_ORDER = [
  'flatrate',
  'free',
  'ads',
  'rent',
  'buy',
] as const satisfies readonly MonetizationType[]

export const MONETIZATION_LABELS: Record<MonetizationType, string> = {
  flatrate: 'Subscription',
  free: 'Free',
  ads: 'With ads',
  rent: 'Rent',
  buy: 'Buy',
}

export type ProviderGroup = {
  monetization: MonetizationType
  label: string
  /** The provider's own TMDB page for this title in this market. */
  link: string
  providers: WatchProvider[]
}

/**
 * Availability is answered per market, and a title being unavailable in the
 * reader's market is a normal answer rather than a missing feature. An absent
 * market key, or a market with no provider in it, is therefore no entry.
 */
export function providersFor(
  providers: WatchProviders | undefined,
  region: string,
): WatchProviderRegionEntry | null {
  const entry = providers?.results?.[region.toUpperCase()]
  if (entry === undefined) return null
  return providerGroups(entry).length === 0 ? null : entry
}

export function providerGroups(
  entry: WatchProviderRegionEntry | null | undefined,
): ProviderGroup[] {
  if (entry === undefined || entry === null) return []
  const groups: ProviderGroup[] = []
  for (const monetization of MONETIZATION_ORDER) {
    const providers = entry[monetization]
    if (providers === undefined || providers.length === 0) continue
    groups.push({
      monetization,
      label: MONETIZATION_LABELS[monetization],
      link: entry.link,
      providers: [...providers].sort(
        (a, b) =>
          a.display_priority - b.display_priority ||
          a.provider_name.localeCompare(b.provider_name),
      ),
    })
  }
  return groups
}

/** A provider offering two kinds of service is one name, not two. */
export function uniqueProviderCount(groups: readonly ProviderGroup[]): number {
  const names = new Set<string>()
  for (const group of groups) {
    for (const provider of group.providers) names.add(provider.provider_name)
  }
  return names.size
}

/**
 * The caption that carries the answer on the cell itself: which kinds of access
 * exist, in the order a reader scans them.
 */
export function providerSummaryLine(
  groups: readonly ProviderGroup[],
): string | null {
  if (groups.length === 0) return null
  return groups.map((group) => group.label).join(' · ')
}
