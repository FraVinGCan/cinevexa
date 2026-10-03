import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useSearchParams } from 'react-router'
import { HashIcon } from 'lucide-react'
import { DetailSkeleton } from '@/components/feedback/detail-skeleton'
import { ErrorState } from '@/components/feedback/error-state'
import { AddressLabel } from '@/components/detail/address-label'
import { DetailPage } from '@/components/detail/detail-page'
import { TitleNotFound } from '@/components/detail/title-not-found'
import { NumberedPagination } from '@/components/pagination/numbered-pagination'
import { MediaGrid } from '@/components/media/media-grid'
import { PosterCard } from '@/components/media/poster-card'
import { keywordDetailOptions, keywordMoviesOptions } from '../keywords'
import { MAX_KEYWORD_PAGE, keywordHref } from '../keyword.schema'
import { usePreferencesStore } from '@/features/preferences/preferences.store'
import { parseTmdbId } from '@/lib/tmdb/id'
import { isTmdbError } from '@/lib/tmdb/errors'

/**
 * A keyword page is a filmography by theme. TMDB answers with the films it tagged,
 * so that list is the whole page; the keyword's own name is the only other thing
 * TMDB publishes, so the header says what the reader is looking at and stops.
 */
export function KeywordPage() {
  const { id: rawId } = useParams()
  const [searchParams] = useSearchParams()
  const id = parseTmdbId(rawId)
  const language = usePreferencesStore((state) => state.language)
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1)

  const keywordQuery = useQuery({
    ...keywordDetailOptions(id ?? 0, language),
    enabled: id !== null,
  })
  const moviesQuery = useQuery({
    ...keywordMoviesOptions(id ?? 0, page, language),
    enabled: id !== null,
  })

  if (id === null) {
    return (
      <DetailPage>
        <TitleNotFound
          subject="keyword"
          action={{ label: 'Look up a theme', to: '/keyword' }}
        />
      </DetailPage>
    )
  }

  if (keywordQuery.isPending) {
    return (
      <DetailPage>
        <DetailSkeleton address="this theme" />
      </DetailPage>
    )
  }

  if (keywordQuery.isError) {
    if (
      isTmdbError(keywordQuery.error) &&
      keywordQuery.error.kind === 'not-found'
    ) {
      return (
        <DetailPage>
          <TitleNotFound
            subject="keyword"
            action={{ label: 'Look up a theme', to: '/keyword' }}
          />
        </DetailPage>
      )
    }
    return (
      <DetailPage>
        <ErrorState
          error={keywordQuery.error}
          onRetry={() => keywordQuery.refetch()}
          action={{ label: 'Look up a theme', to: '/keyword' }}
        />
      </DetailPage>
    )
  }

  const keyword = keywordQuery.data
  const totalPages = Math.min(
    moviesQuery.data?.total_pages ?? 0,
    MAX_KEYWORD_PAGE,
  )

  return (
    <DetailPage>
      <header className="flex flex-col gap-3">
        <AddressLabel>
          Theme
          <span className="text-muted-foreground">·</span>
          <Link
            to="/keyword"
            className="underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
            all themes
          </Link>
        </AddressLabel>
        <h1 className="flex flex-wrap items-baseline gap-x-2 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          <HashIcon
            aria-hidden
            className="size-7 self-center text-muted-foreground"
          />
          {keyword.name}
        </h1>
      </header>

      {moviesQuery.isError ? (
        <ErrorState
          error={moviesQuery.error}
          onRetry={() => moviesQuery.refetch()}
          action={{ label: 'Browse films', to: '/discover/movies' }}
        />
      ) : moviesQuery.isPending ? (
        <p role="status" className="text-sm text-muted-foreground">
          Reading the films tagged with this theme…
        </p>
      ) : (moviesQuery.data?.results.length ?? 0) === 0 ? (
        <NoTaggedFilms name={keyword.name} />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {moviesQuery.data?.total_results ?? 0}{' '}
            {(moviesQuery.data?.results.length ?? 0) === 1 ? 'film' : 'films'}{' '}
            tagged with this theme
          </p>
          <MediaGrid>
            {moviesQuery.data?.results.map((item) => (
              <PosterCard key={item.id} item={item} />
            ))}
          </MediaGrid>
          <NumberedPagination
            page={page}
            totalPages={totalPages}
            buildHref={(next) => keywordHref(id, next)}
          />
        </>
      )}
    </DetailPage>
  )
}

function NoTaggedFilms({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-4xl border border-dashed px-5 py-8">
      <HashIcon aria-hidden className="size-5 text-muted-foreground" />
      <p className="text-sm font-medium text-card-foreground">
        No films are tagged with {name}
      </p>
      <p className="max-w-[60ch] text-sm text-muted-foreground">
        TMDB keeps the tag and has no films attached to it. The tag is still
        addressable, so a shared link to this page resolves.
      </p>
    </div>
  )
}
