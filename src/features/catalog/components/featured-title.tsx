import { useMemo } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { FilmIcon } from 'lucide-react'
import { MediaHero } from '@/components/media/media-hero'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { MediaHeroSkeleton } from '@/components/feedback/media-hero-skeleton'
import { Button } from '@/components/ui/button'
import { isTrendingTitle, trendingOptions } from '@/features/catalog/trending'
import type { TrendingResult } from '@/types/tmdb'

const NO_RESULTS: TrendingResult[] = []

export function FeaturedTitle() {
  const query = useQuery(trendingOptions('all', 'day'))

  const featured = useMemo(() => {
    const results = query.data?.results ?? NO_RESULTS
    return results.find(isTrendingTitle) ?? null
  }, [query.data])

  if (query.isPending) return <MediaHeroSkeleton />

  if (query.isError) {
    return (
      <ErrorState
        error={query.error}
        onRetry={() => query.refetch()}
        action={{ label: 'Browse movies', to: '/discover/movies' }}
      />
    )
  }

  if (!featured) {
    return (
      <EmptyState
        icon={FilmIcon}
        title="Nothing is trending today"
        description="TMDB returned no trending titles for today. Retry shortly, or open the catalogue and pick a channel.">
        <Button nativeButton={false} render={<Link to="/discover/movies" />}>
          Browse movies
        </Button>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link to="/discover/tv" />}>
          Browse TV
        </Button>
      </EmptyState>
    )
  }

  return <MediaHero label="Trending today" item={featured} />
}
