import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MediaGrid } from '@/components/media/media-grid'
import { PosterCard } from '@/components/media/poster-card'
import { MediaGridSkeleton } from '@/components/feedback/media-grid-skeleton'
import { ErrorState } from '@/components/feedback/error-state'
import { EmptyState } from '@/components/feedback/empty-state'
import { accountMediaOptions, recommendationsOptions } from '../account.queries'
import { useAuthStore } from '@/features/auth/auth.store'
import { RequireSession } from '@/features/auth/components/require-session'
import type { TitleMediaType } from '@/types/tmdb'

const kinds = ['watchlist', 'favorite', 'rated'] as const

export function AccountPage() {
  const [params, setParams] = useSearchParams()
  const accountId = useAuthStore((s) => s.accountId)
  const status = useAuthStore((s) => s.status)
  const accountObjectId = useAuthStore((s) => s.accountObjectId)
  const bearerToken = useAuthStore((s) => s.v4AccessToken)
  const kind = kinds.includes(params.get('tab') as (typeof kinds)[number])
    ? (params.get('tab') as (typeof kinds)[number])
    : 'watchlist'
  const mediaType: TitleMediaType = params.get('type') === 'tv' ? 'tv' : 'movie'
  const query = useQuery({
    ...accountMediaOptions(accountId ?? 0, kind, mediaType, 1),
    enabled: status === 'authenticated' && Boolean(accountId),
  })
  const recommendationQuery = useQuery({
    ...recommendationsOptions(
      accountObjectId ?? '',
      mediaType,
      1,
      bearerToken ?? '',
    ),
    enabled: Boolean(accountObjectId && bearerToken),
  })
  const fallbackQuery = useQuery({
    ...accountMediaOptions(accountId ?? 0, 'favorite', mediaType, 1),
    enabled: status === 'authenticated' && Boolean(accountId),
  })
  const recommendationItems = recommendationQuery.data?.results?.length
    ? recommendationQuery.data.results
    : (fallbackQuery.data?.results ?? [])
  const change = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    next.set(key, value)
    setParams(next)
  }

  return (
    <RequireSession>
      <main className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-10 sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Personal library
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold">
            My library
          </h1>
        </div>
        <Tabs value={kind} onValueChange={(value) => change('tab', value)}>
          <TabsList>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="favorite">Favourites</TabsTrigger>
            <TabsTrigger value="rated">Rated</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2">
          <button
            className={`min-h-11 rounded-full px-4 text-sm ${mediaType === 'movie' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => change('type', 'movie')}>
            Films
          </button>
          <button
            className={`min-h-11 rounded-full px-4 text-sm ${mediaType === 'tv' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            onClick={() => change('type', 'tv')}>
            Series
          </button>
        </div>
        {query.isPending ? (
          <MediaGridSkeleton count={8} />
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : query.data.results.length === 0 ? (
          <EmptyState
            title={`No ${kind === 'favorite' ? 'favourites' : kind} yet`}
            description="Save titles from their detail page and they will appear here."
          />
        ) : (
          <MediaGrid>
            {query.data.results.map((item) => (
              <PosterCard key={item.id} item={item} />
            ))}
          </MediaGrid>
        )}
        <section className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Personal signal
            </p>
            <h2 className="mt-1 font-heading text-xl font-medium">
              Recommended for you
            </h2>
          </div>
          {recommendationItems.length ? (
            <MediaGrid>
              {recommendationItems.slice(0, 4).map((item) => (
                <PosterCard key={item.id} item={item} />
              ))}
            </MediaGrid>
          ) : (
            <p className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
              Recommendations will grow from the titles in your watchlist and
              favourites.
            </p>
          )}
        </section>
      </main>
    </RequireSession>
  )
}
