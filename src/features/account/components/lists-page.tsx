import { useState } from 'react'
import { Link } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ErrorState } from '@/components/feedback/error-state'
import { EmptyState } from '@/components/feedback/empty-state'
import { accountListsOptions } from '../account.queries'
import { createList, deleteList } from '../account.api'
import { useAuthStore } from '@/features/auth/auth.store'
import { RequireSession } from '@/features/auth/components/require-session'

const listSchema = z.object({
  name: z.string().trim().min(1).max(64),
  description: z.string().max(500),
  language: z.string().length(2),
})
type ListForm = z.infer<typeof listSchema>
const LIST_LANGUAGES = [
  ['en', 'English'],
  ['es', 'Español'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
  ['it', 'Italiano'],
  ['pt', 'Português'],
  ['ja', '日本語'],
  ['ko', '한국어'],
] as const

export function ListsPage() {
  const accountId = useAuthStore((s) => s.accountId)
  const status = useAuthStore((s) => s.status)
  const queryClient = useQueryClient()
  const query = useQuery({
    ...accountListsOptions(accountId ?? 0),
    enabled: status === 'authenticated' && Boolean(accountId),
  })
  const [formOpen, setFormOpen] = useState(false)
  const [deleteListId, setDeleteListId] = useState<number | null>(null)
  const form = useForm<ListForm>({
    resolver: zodResolver(listSchema),
    defaultValues: { name: '', description: '', language: 'en' },
  })
  const create = useMutation({
    mutationFn: createList,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: accountListsOptions(accountId ?? 0).queryKey,
      })
      form.reset()
      setFormOpen(false)
    },
  })
  const remove = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: accountListsOptions(accountId ?? 0).queryKey,
      })
      setDeleteListId(null)
    },
  })

  return (
    <RequireSession>
      <main className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Personal library
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold">
              Custom lists
            </h1>
          </div>
          <Button onClick={() => setFormOpen((open) => !open)}>
            {formOpen ? 'Close' : 'New list'}
          </Button>
        </div>
        {formOpen && (
          <form
            className="grid gap-4 rounded-4xl bg-card p-6 shadow-md sm:grid-cols-2"
            onSubmit={form.handleSubmit((values) => create.mutate(values))}>
            <Input
              placeholder="List name"
              aria-label="List name"
              {...form.register('name')}
            />
            <Controller
              control={form.control}
              name="language"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-label="List language" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LIST_LANGUAGES.map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Textarea
              className="sm:col-span-2"
              placeholder="Description (optional)"
              aria-label="Description"
              {...form.register('description')}
            />
            <div className="sm:col-span-2">
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? 'Creating…' : 'Create list'}
              </Button>
              {form.formState.errors.name && (
                <p className="mt-2 text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </form>
        )}
        {query.isPending ? (
          <p className="text-sm text-muted-foreground">Loading your lists…</p>
        ) : query.isError ? (
          <ErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : query.data.results.length === 0 ? (
          <EmptyState
            title="No custom lists yet"
            description="Create a list when you want a shelf TMDB does not provide."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {query.data.results.map((list) => (
              <article
                key={list.id}
                className="rounded-4xl bg-card p-6 shadow-md">
                <Link
                  className="font-heading text-lg font-medium hover:underline"
                  to={`/list/${list.id}`}>
                  {list.name}
                </Link>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {list.description || 'No description'}
                </p>
                <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{list.item_count} titles</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteListId(list.id)}
                    disabled={remove.isPending}>
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
        <Dialog
          open={deleteListId !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteListId(null)
          }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this list?</DialogTitle>
              <DialogDescription>
                This permanently deletes the list and all of its items from your
                TMDB account.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button
                variant="destructive"
                disabled={remove.isPending}
                onClick={() => {
                  if (deleteListId !== null) remove.mutate(deleteListId)
                }}>
                {remove.isPending ? 'Deleting…' : 'Delete list'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </RequireSession>
  )
}
