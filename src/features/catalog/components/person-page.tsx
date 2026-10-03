import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { ExternalLinkIcon } from 'lucide-react'
import { DetailSkeleton } from '@/components/feedback/detail-skeleton'
import { ErrorState } from '@/components/feedback/error-state'
import { AddressLabel } from '@/components/detail/address-label'
import { DetailPage } from '@/components/detail/detail-page'
import { DetailSection } from '@/components/detail/detail-section'
import { TitleFacts } from '@/components/detail/title-facts'
import { TitleNotFound } from '@/components/detail/title-not-found'
import { MediaGallery } from '@/components/gallery/media-gallery'
import { personGalleryItemsOf } from '@/components/gallery/gallery-items'
import { MediaGrid } from '@/components/media/media-grid'
import { PosterCard } from '@/components/media/poster-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { personDetailOptions } from '../people'
import { usePreferencesStore } from '@/features/preferences/preferences.store'
import { formatDayMonthYear, titleCase } from '@/lib/tmdb/format'
import { parseTmdbId } from '@/lib/tmdb/id'
import { isTmdbError } from '@/lib/tmdb/errors'
import type { PersonDetail, TitleListItem } from '@/types/tmdb'

type FilmographyOrder = 'popularity' | 'recent' | 'oldest'

/** A combined credit is a title with the part played or done folded in. */
type FilmographyCredit = TitleListItem & {
  credit_id: string
  character?: string
  job?: string
}

const ORDERS: { value: FilmographyOrder; label: string }[] = [
  { value: 'popularity', label: 'Popular' },
  { value: 'recent', label: 'Recent' },
  { value: 'oldest', label: 'Oldest' },
]

/**
 * A person is read through their work, so the filmography leads and the
 * biography sits above it as the reason to keep reading. Everything arrives in
 * one request: TMDB has no separate portrait or credit call worth making.
 */
export function PersonPage() {
  const { id: rawId } = useParams()
  const id = parseTmdbId(rawId)
  const language = usePreferencesStore((state) => state.language)
  const [order, setOrder] = useState<FilmographyOrder>('popularity')

  const query = useQuery({
    ...personDetailOptions(id ?? 0, language),
    enabled: id !== null,
  })

  const credits = query.data?.combined_credits
  const acting = useMemo(
    () => sortCredits(credits?.cast ?? [], order),
    [credits, order],
  )
  const directing = useMemo(
    () => sortCredits(credits?.crew ?? [], order),
    [credits, order],
  )

  if (id === null) {
    return (
      <DetailPage>
        <TitleNotFound
          subject="person"
          action={{ label: 'Search the index', to: '/search' }}
        />
      </DetailPage>
    )
  }

  if (query.isPending) {
    return (
      <DetailPage>
        <DetailSkeleton address="this person" />
      </DetailPage>
    )
  }

  if (query.isError) {
    if (isTmdbError(query.error) && query.error.kind === 'not-found') {
      return (
        <DetailPage>
          <TitleNotFound
            subject="person"
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

  const person = query.data
  const images = personGalleryItemsOf(person.images?.profiles, person.name)
  const alsoKnown = [...new Set(person.also_known_as)].filter(
    (name) => name !== person.name,
  )
  const lifespan = lifespanOf(person)

  return (
    <DetailPage>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <PersonPortrait person={person} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <AddressLabel>{titleCase(person.known_for_department)}</AddressLabel>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {person.name}
          </h1>
          {person.biography !== null && person.biography !== '' && (
            <p className="max-w-[70ch] text-sm/relaxed text-pretty text-muted-foreground">
              {person.biography}
            </p>
          )}
        </div>
      </header>

      <TitleFacts
        items={[
          ...(lifespan === null ? [] : [lifespan]),
          {
            term: 'From',
            description: person.place_of_birth,
          },
          {
            term: 'Known for',
            description: titleCase(person.known_for_department),
          },
          { term: 'Other names', description: alsoKnown.join(' · ') || null },
          {
            term: 'IMDb',
            description:
              person.imdb_id === null
                ? null
                : `nm${person.imdb_id.replace(/^nm/, '')}`,
          },
        ]}
      />

      {(acting.length > 0 || directing.length > 0) && (
        <DetailSection
          label="Filmography"
          heading="What they are in"
          action={<OrderControl order={order} onChange={setOrder} />}>
          <Tabs defaultValue="acting">
            <TabsList variant="line">
              {acting.length > 0 && (
                <TabsTrigger value="acting">
                  Acting
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {acting.length}
                  </span>
                </TabsTrigger>
              )}
              {directing.length > 0 && (
                <TabsTrigger value="crew">
                  Crew
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {directing.length}
                  </span>
                </TabsTrigger>
              )}
            </TabsList>

            {acting.length > 0 && (
              <TabsContent value="acting" className="mt-4">
                <MediaGrid>
                  {acting.map((credit) => (
                    <CreditCell key={credit.credit_id} credit={credit} />
                  ))}
                </MediaGrid>
              </TabsContent>
            )}
            {directing.length > 0 && (
              <TabsContent value="crew" className="mt-4">
                <MediaGrid>
                  {directing.map((credit) => (
                    <CreditCell key={credit.credit_id} credit={credit} />
                  ))}
                </MediaGrid>
              </TabsContent>
            )}
          </Tabs>
        </DetailSection>
      )}

      {images.length > 0 && (
        <DetailSection
          label="Portraits"
          heading="Photographs"
          action={
            <p className="text-xs text-muted-foreground tabular-nums">
              {images.length} {images.length === 1 ? 'portrait' : 'portraits'}
            </p>
          }>
          <MediaGallery
            title={person.name}
            images={images}
            videos={[]}
            emptyLabel=""
          />
        </DetailSection>
      )}

      {person.homepage !== null && person.homepage !== '' && (
        <DetailSection
          label="Elsewhere"
          heading="Their own pages"
          action={
            <ExternalLinkIcon
              aria-hidden
              className="size-4 text-muted-foreground"
            />
          }>
          <a
            href={person.homepage}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
            {person.homepage.replace(/^https?:\/\//, '')}
            <ExternalLinkIcon aria-hidden className="size-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </DetailSection>
      )}
    </DetailPage>
  )
}

function PersonPortrait({ person }: { person: PersonDetail }) {
  return (
    <img
      src={profileOriginal(person.profile_path)}
      alt={person.name}
      width={500}
      height={750}
      className="w-40 shrink-0 rounded-4xl bg-surface-raised object-cover shadow-md ring-1 ring-foreground/5 sm:w-48 dark:ring-foreground/10"
    />
  )
}

function profileOriginal(path: string | null): string {
  return path === null
    ? '/favicon.svg'
    : `https://image.tmdb.org/t/p/w500${path}`
}

/**
 * The lifespan a reader can act on, rather than two dates side by side. The term
 * changes with the data so a living person's cell never reads "Born: Born 1963".
 */
function lifespanOf(person: PersonDetail): {
  term: string
  description: string
} | null {
  const born = formatDayMonthYear(person.birthday)
  if (born === null || person.birthday === null) return null
  const died = formatDayMonthYear(person.deathday)
  return died === null
    ? { term: 'Born', description: born }
    : { term: 'Lifespan', description: `${born} – ${died}` }
}

/**
 * A credit is a title plus the part played or done, so the cell is the poster with
 * the job under the name. The role and the job are kept in the cell rather than
 * left to the title's own page, because on a filmography the role is the reason
 * the credit is here.
 */
function CreditCell({ credit }: { credit: FilmographyCredit }) {
  const role =
    'character' in credit && credit.character !== ''
      ? credit.character
      : 'job' in credit && credit.job !== ''
        ? credit.job
        : null

  return (
    <PosterCard
      item={credit}
      className="h-full"
      trailing={
        role === null ? undefined : (
          <p className="line-clamp-2 text-xs text-muted-foreground">{role}</p>
        )
      }
    />
  )
}

function OrderControl({
  order,
  onChange,
}: {
  order: FilmographyOrder
  onChange: (order: FilmographyOrder) => void
}) {
  return (
    <div role="group" aria-label="Order the filmography" className="flex gap-1">
      {ORDERS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={order === option.value}
          onClick={() => onChange(option.value)}
          className={`min-h-11 rounded-full px-3 text-xs font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none ${
            order === option.value
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:text-foreground'
          }`}>
          {option.label}
        </button>
      ))}
    </div>
  )
}

/** TMDB sends credits newest-first and popularity-ordered per channel; both are
 * offered because a reader looking for a role and one looking for a landmark
 * want different orders. */
function sortCredits<T extends TitleListItem>(
  credits: readonly T[],
  order: FilmographyOrder,
): T[] {
  const sorted = [...credits]
  if (order === 'popularity') {
    return sorted.sort((a, b) => b.popularity - a.popularity)
  }
  if (order === 'recent') {
    return sorted.sort((a, b) => dateOf(b).localeCompare(dateOf(a)))
  }
  return sorted.sort((a, b) => dateOf(a).localeCompare(dateOf(b)))
}

function dateOf(item: TitleListItem): string {
  return 'release_date' in item ? item.release_date : item.first_air_date
}
