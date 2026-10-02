import { FeaturedTitle } from '@/features/catalog/components/featured-title'
import {
  CatalogueRail,
  TrendingRail,
} from '@/features/catalog/components/title-rail'
import { CATALOGUE_RAILS } from '@/features/catalog/rails'
import { TRENDING_WINDOWS } from '@/features/catalog/trending'

export function Component() {
  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-10 px-4 py-10 sm:px-6">
      <FeaturedTitle />
      <div className="flex flex-col gap-8">
        {TRENDING_WINDOWS.map((trendingWindow) => (
          <TrendingRail key={trendingWindow} trendingWindow={trendingWindow} />
        ))}
        {CATALOGUE_RAILS.map((definition) => (
          <CatalogueRail
            key={`${definition.mediaType}-${definition.id}`}
            definition={definition}
          />
        ))}
      </div>
    </div>
  )
}
