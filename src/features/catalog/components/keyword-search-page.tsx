import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router'
import { HashIcon, SearchIcon, XIcon } from 'lucide-react'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { NumberedPagination } from '@/components/pagination/numbered-pagination'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { keywordSearchOptions } from '../keywords'
import { MAX_KEYWORD_PAGE, keywordSearchHref } from '../keyword.schema'
import { useDebouncedInput } from '@/lib/hooks/useDebouncedInput'
import { isTmdbError } from '@/lib/tmdb/errors'

const KEYWORD_QUERY_MAX = 40

export type KeywordSearchState = {
  query: string
  page: number
}

/**
 * TMDB's own keyword index. A keyword is a tag TMDB attaches to titles, so
 * searching for one here is looking up a word rather than a title — the same
 * division `/search` makes, with only one channel to answer in.
 */
export function KeywordSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const page = Math.max(1, Number(searchParams.get('page') ?? 1) || 1)

  const commit = useCallback(
    (next: string) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current)
          if (next.trim() === '') params.delete('q')
          else params.set('q', next)
          params.delete('page')
          return params
        },
        { replace: true, preventScrollReset: true },
      )
    },
    [setSearchParams],
  )

  const search = useQuery(keywordSearchOptions(query, page))
  const field = useDebouncedInput({ value: query, onCommit: commit })

  const keywords = useMemo(
    () => (search.data?.results ?? []).filter((keyword) => keyword.name !== ''),
    [search.data],
  )

  const searched = query.trim() !== ''
  const totalPages = Math.min(search.data?.total_pages ?? 0, MAX_KEYWORD_PAGE)

  return (
    <div className="mx-auto flex w-full max-w-content flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs tracking-[0.2em] text-primary uppercase">
            Themes
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {searched ? `Keywords for “${query.trim()}”` : 'Look up a theme'}
          </h1>
        </div>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            commit(field.value)
          }}>
          <InputGroup className="h-11">
            <InputGroupAddon align="inline-start">
              <HashIcon aria-hidden />
            </InputGroupAddon>
            <InputGroupInput
              value={field.value}
              onChange={(event) => field.setValue(event.target.value)}
              maxLength={KEYWORD_QUERY_MAX}
              autoComplete="off"
              autoFocus
              aria-label="Search TMDB keywords"
              placeholder="time travel, heist, coming of age"
            />
            <InputGroupAddon align="inline-end">
              {field.value !== '' && (
                <InputGroupButton
                  size="icon-sm"
                  aria-label="Clear search"
                  onClick={() => commit('')}>
                  <XIcon />
                </InputGroupButton>
              )}
            </InputGroupAddon>
          </InputGroup>
        </form>
      </header>

      {!searched ? (
        <EmptyState
          icon={HashIcon}
          className="border-dashed"
          title="No theme asked for yet"
          description="TMDB attaches keywords to the titles it catalogues. Look one up here, then read the films it collects.">
          <Button nativeButton={false} render={<Link to="/discover/movies" />}>
            Browse films
          </Button>
        </EmptyState>
      ) : search.isError ? (
        isTmdbError(search.error) && search.error.kind === 'parameters' ? (
          <EmptyState
            icon={SearchIcon}
            className="border-dashed"
            title="TMDB would not search for that"
            description="Keywords are a fixed list, so TMDB answers a lookup or it does not. A shorter or plainer word usually lands."
          />
        ) : (
          <ErrorState
            error={search.error}
            onRetry={() => search.refetch()}
            action={{ label: 'Browse films', to: '/discover/movies' }}
          />
        )
      ) : search.isPending ? (
        <p role="status" className="text-sm text-muted-foreground">
          Looking up keywords…
        </p>
      ) : keywords.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          className="border-dashed"
          title="No keyword matches that"
          description={`TMDB has no keyword called “${query.trim()}”. It tags titles with a few thousand fixed terms, so a phrase or a synonym is likelier to land than a description.`}
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {search.data?.total_results ?? keywords.length}{' '}
            {keywords.length === 1 ? 'keyword' : 'keywords'}
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {keywords.map((keyword) => (
              <li key={keyword.id}>
                <Link
                  to={`/keyword/${keyword.id}`}
                  className="flex min-h-11 items-center gap-2 rounded-4xl bg-card px-4 py-3 shadow-md ring-1 ring-foreground/5 transition-colors hover:bg-surface-raised focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none dark:ring-foreground/10">
                  <HashIcon
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  <span className="truncate font-heading text-sm font-medium text-card-foreground">
                    {keyword.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <NumberedPagination
            page={page}
            totalPages={totalPages}
            buildHref={(next) => keywordSearchHref(query, next)}
          />
        </>
      )}
    </div>
  )
}
