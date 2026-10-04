import { useState } from 'react'
import {
  BookmarkIcon,
  CheckIcon,
  HeartIcon,
  ListPlusIcon,
  StarIcon,
  XIcon,
} from 'lucide-react'
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { toast } from '@/components/ui/toast-manager'
import {
  accountListsOptions,
  accountStatesOptions,
  listOptions,
} from '../account.queries'
import { addListItem, removeListItem } from '../account.api'
import { useAccountStateMutation, useRatingMutation } from '../mutations'
import { useAuthStore } from '@/features/auth/auth.store'
import { describeError } from '@/lib/tmdb/errors'
import type { TitleMediaType } from '@/types/tmdb'

export function LibraryActions({
  mediaType,
  id,
}: {
  mediaType: TitleMediaType
  id: number
}) {
  const status = useAuthStore((s) => s.status)
  const state = useQuery({
    ...accountStatesOptions(mediaType, id),
    enabled: status === 'authenticated',
  })
  const updateState = useAccountStateMutation()
  const updateRating = useRatingMutation(mediaType, id)
  const accountId = useAuthStore((s) => s.accountId)
  const lists = useQuery({
    ...accountListsOptions(accountId ?? 0),
    enabled: status === 'authenticated' && Boolean(accountId),
  })
  const listDetails = useQueries({
    queries: (lists.data?.results ?? []).map((list) => ({
      ...listOptions(list.id),
      enabled: status === 'authenticated' && mediaType === 'movie',
    })),
  })
  const queryClient = useQueryClient()
  const [selectedListOverride, setSelectedListOverride] = useState<
    number[] | null
  >(null)
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const [ratingPickerOpen, setRatingPickerOpen] = useState(false)
  const [ratingValue, setRatingValue] = useState<number | null>(null)
  const memberListIds = listDetails.flatMap((query, index) => {
    const list = lists.data?.results[index]
    return list &&
      query.data?.results.some(
        (item) => item.id === id && item.media_type !== 'tv',
      )
      ? [list.id]
      : []
  })
  const selectedLists = selectedListOverride ?? memberListIds
  const membershipReady =
    mediaType !== 'movie' ||
    (lists.isSuccess && listDetails.every((query) => query.isSuccess))
  const addToLists = useMutation({
    mutationFn: async () => {
      const current = new Set(memberListIds)
      const selected = new Set(selectedLists)
      await Promise.all([
        ...selectedLists
          .filter((listId) => !current.has(listId))
          .map((listId) => addListItem(listId, id)),
        ...memberListIds
          .filter((listId) => !selected.has(listId))
          .map((listId) => removeListItem(listId, id)),
      ])
    },
    onSuccess: () => {
      toast.add({
        title: 'Lists updated',
        description: 'Your list selections have been saved.',
        type: 'success',
      })
      void queryClient.invalidateQueries({
        queryKey: accountListsOptions(accountId ?? 0).queryKey,
      })
      void queryClient.invalidateQueries({
        queryKey: listOptions(0).queryKey.slice(0, 1),
      })
      setSelectedListOverride(null)
      setListPickerOpen(false)
    },
    onError: (error) => {
      const copy = describeError(error)
      toast.add({ title: copy.title, description: copy.message, type: 'error' })
    },
  })
  if (status !== 'authenticated') return null
  if (state.isPending || state.isError || !state.data) return null
  const account = state.data
  const busy =
    updateState.isPending || updateRating.isPending || addToLists.isPending
  const sliderValue =
    ratingValue ?? (account.rated === false ? 5 : account.rated.value)

  return (
    <div
      className="flex flex-wrap gap-2"
      aria-label={`Library actions for this ${mediaType}`}>
      <Button
        variant={account.watchlist ? 'default' : 'outline'}
        size="sm"
        disabled={busy}
        onClick={() =>
          updateState.mutate({
            mediaType,
            id,
            field: 'watchlist',
            value: !account.watchlist,
          })
        }>
        <BookmarkIcon /> {account.watchlist ? 'In watchlist' : 'Watchlist'}
      </Button>
      <Button
        variant={account.favorite ? 'default' : 'outline'}
        size="sm"
        disabled={busy}
        onClick={() =>
          updateState.mutate({
            mediaType,
            id,
            field: 'favorite',
            value: !account.favorite,
          })
        }>
        <HeartIcon /> {account.favorite ? 'Favourited' : 'Favourite'}
      </Button>
      <Popover open={ratingPickerOpen} onOpenChange={setRatingPickerOpen}>
        <div className="group relative">
          <PopoverTrigger
            render={
              <Button
                variant={account.rated !== false ? 'default' : 'outline'}
                size="sm"
                disabled={busy}
              />
            }>
            <StarIcon className="text-rating-gold" />{' '}
            {account.rated === false ? 'Rate' : account.rated.value.toFixed(1)}
          </PopoverTrigger>
          {account.rated !== false && (
            <Button
              type="button"
              size="icon"
              className="absolute -right-1.5 -top-1.5 size-5 rounded-full border-2 border-background p-0 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              disabled={busy}
              aria-label="Clear rating"
              title="Clear rating"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation()
                setRatingValue(null)
                updateRating.mutate(null)
                setRatingPickerOpen(false)
              }}>
              <XIcon className="size-3.5" />
            </Button>
          )}
        </div>
        <PopoverContent align="start" className="w-80">
          <PopoverHeader>
            <PopoverTitle>Rate this title</PopoverTitle>
            <PopoverDescription>
              Choose a rating from 0.5 to 10 in 0.5 steps.
            </PopoverDescription>
          </PopoverHeader>
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <Slider
                aria-label="Your rating from 0.5 to 10 in 0.5 steps"
                min={0.5}
                max={10}
                step={0.5}
                value={[sliderValue]}
                disabled={busy}
                onValueChange={(value) =>
                  setRatingValue(Array.isArray(value) ? value[0] : value)
                }
              />
              <output className="w-10 text-right text-lg font-medium tabular-nums">
                {sliderValue.toFixed(1)}
              </output>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={busy}
                onClick={() => {
                  updateRating.mutate(sliderValue)
                  setRatingPickerOpen(false)
                }}>
                Save rating
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {mediaType === 'movie' && lists.data && lists.data.results.length > 0 && (
        <Popover open={listPickerOpen} onOpenChange={setListPickerOpen}>
          <PopoverTrigger
            render={<Button variant="outline" size="sm" disabled={busy} />}>
            <ListPlusIcon />{' '}
            {selectedLists.length > 0
              ? `${selectedLists.length} selected`
              : 'Add to lists'}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80">
            <PopoverHeader>
              <PopoverTitle>Add this movie to lists</PopoverTitle>
              <PopoverDescription>
                Checked lists already contain this movie. Select or clear lists,
                then save.
              </PopoverDescription>
            </PopoverHeader>
            <div className="grid max-h-60 gap-1 overflow-y-auto pr-1">
              {lists.data.results.map((list) => {
                const checked = selectedLists.includes(list.id)
                return (
                  <label
                    key={list.id}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl px-2 hover:bg-muted">
                    <Checkbox
                      checked={checked}
                      disabled={!membershipReady || busy}
                      onCheckedChange={(value) =>
                        setSelectedListOverride((current) => {
                          const selected = current ?? memberListIds
                          return value
                            ? [...selected, list.id]
                            : selected.filter((listId) => listId !== list.id)
                        })
                      }
                    />
                    <span className="min-w-0 flex-1 truncate">{list.name}</span>
                    {checked && <CheckIcon className="size-4 text-primary" />}
                  </label>
                )
              })}
            </div>
            <Button
              className="w-full"
              disabled={!membershipReady || addToLists.isPending}
              onClick={() => addToLists.mutate()}>
              {addToLists.isPending ? 'Saving…' : 'Save list changes'}
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
