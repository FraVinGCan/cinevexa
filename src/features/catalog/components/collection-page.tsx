import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { LibraryIcon } from 'lucide-react'
import { DetailSkeleton } from '@/components/feedback/detail-skeleton'
import { ErrorState } from '@/components/feedback/error-state'
import { AddressLabel } from '@/components/detail/address-label'
import { DetailPage } from '@/components/detail/detail-page'
import { TitleNotFound } from '@/components/detail/title-not-found'
import { MediaGrid } from '@/components/media/media-grid'
import { PosterCard } from '@/components/media/poster-card'
import { collectionDetailOptions } from '../collections'
import { usePreferencesStore } from '@/features/preferences/preferences.store'
import { parseTmdbId } from '@/lib/tmdb/id'
import { isTmdbError } from '@/lib/tmdb/errors'

/**
 * A collection is a shelf, not a title: TMDB publishes a name, a sentence, and the
 * parts, and nothing else worth a hero. The list is therefore the page, and the
 * header says how many parts there are rather than inventing a rating for it.
 */
export function CollectionPage() {
  const { id: rawId } = useParams()
  const id = parseTmdbId(rawId)
  const language = usePreferencesStore((state) => state.language)

  const query = useQuery({
    ...collectionDetailOptions(id ?? 0, language),
    enabled: id !== null,
  })

  if (id === null) {
    return (
      <DetailPage>
        <TitleNotFound
          subject="collection"
          action={{ label: 'Search the index', to: '/search' }}
        />
      </DetailPage>
    )
  }

  if (query.isPending) {
    return (
      <DetailPage>
        <DetailSkeleton address="this collection" />
      </DetailPage>
    )
  }

  if (query.isError) {
    if (isTmdbError(query.error) && query.error.kind === 'not-found') {
      return (
        <DetailPage>
          <TitleNotFound
            subject="collection"
            action={{ label: 'Search the index', to: '/search' }}
          />
        </DetailPage>
      )
    }
    return (
      <DetailPage>
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      </DetailPage>
    )
  }

  const collection = query.data
  const parts = collection.parts
  const films = parts.filter((part) => 'title' in part).length

  return (
    <DetailPage>
      <header className="flex flex-col gap-3">
        <AddressLabel>
          Collection
          <span className="text-muted-foreground">·</span>
          {parts.length} {parts.length === 1 ? 'part' : 'parts'}
          {films !== parts.length && films > 0 && (
            <>
              <span className="text-muted-foreground">·</span>
              {films} {films === 1 ? 'film' : 'films'}
            </>
          )}
        </AddressLabel>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {collection.name}
        </h1>
        {collection.overview !== '' && (
          <p className="max-w-[70ch] text-sm/relaxed text-pretty text-muted-foreground">
            {collection.overview}
          </p>
        )}
      </header>

      {parts.length === 0 ? (
        <EmptyCollection name={collection.name} />
      ) : (
        <MediaGrid>
          {parts.map((part) => (
            <PosterCard
              key={`${part.media_type ?? 'movie'}-${part.id}`}
              item={part}
            />
          ))}
        </MediaGrid>
      )}
    </DetailPage>
  )
}

function EmptyCollection({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-4xl border border-dashed px-5 py-8">
      <LibraryIcon aria-hidden className="size-5 text-muted-foreground" />
      <p className="text-sm font-medium text-card-foreground">
        TMDB lists {name} with no parts yet
      </p>
      <p className="max-w-[60ch] text-sm text-muted-foreground">
        A collection page is only its parts. Once TMDB records them, each one
        appears here with a poster and its own page behind it.
      </p>
    </div>
  )
}
