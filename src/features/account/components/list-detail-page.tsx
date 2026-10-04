import { useState } from 'react'
import { useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MediaGrid } from '@/components/media/media-grid'
import { PosterCard } from '@/components/media/poster-card'
import { ErrorState } from '@/components/feedback/error-state'
import { EmptyState } from '@/components/feedback/empty-state'
import { listOptions } from '../account.queries'
import { clearList, removeListItem } from '../account.api'
import { RequireSession } from '@/features/auth/components/require-session'
import { parseTmdbId } from '@/lib/tmdb/id'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function ListDetailPage() {
  const id = parseTmdbId(useParams().id)
  const queryClient = useQueryClient()
  const [clearOpen, setClearOpen] = useState(false)
  const query = useQuery({ ...listOptions(id ?? 0), enabled: id !== null })
  const clear = useMutation({
    mutationFn: clearList,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: listOptions(id!).queryKey,
      })
      setClearOpen(false)
    },
  })
  const remove = useMutation({
    mutationFn: (mediaId: number) => removeListItem(id!, mediaId),
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: listOptions(id!).queryKey,
      }),
  })
  if (id === null)
    return (
      <EmptyState
        title="List not found"
        description="That list address is not valid."
      />
    )
  return (
    <RequireSession>
      <main className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-10 sm:px-6">
        {query.isPending ? (
          <p>Loading list…</p>
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Custom list
                </p>
                <h1 className="mt-2 font-heading text-3xl font-semibold">
                  {query.data.name}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {query.data.description}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setClearOpen(true)}
                disabled={clear.isPending}>
                Clear list
              </Button>
            </div>
            {query.data.results.length === 0 ? (
              <EmptyState
                title="This list is empty"
                description="Add titles from their detail pages when you find something worth keeping."
              />
            ) : (
              <MediaGrid>
                {query.data.results.map((item) => (
                  <div
                    key={`${item.media_type ?? 'movie'}-${item.id}`}
                    className="flex min-w-0 flex-col gap-2">
                    <PosterCard item={item} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => remove.mutate(item.id)}
                      disabled={remove.isPending}>
                      Remove from list
                    </Button>
                  </div>
                ))}
              </MediaGrid>
            )}
          </>
        )}
        <Dialog open={clearOpen} onOpenChange={setClearOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear this list?</DialogTitle>
              <DialogDescription>
                This removes every title from the list. The list itself will
                remain available.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button
                variant="destructive"
                disabled={clear.isPending}
                onClick={() => clear.mutate(id)}>
                {clear.isPending ? 'Clearing…' : 'Clear list'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </RequireSession>
  )
}
