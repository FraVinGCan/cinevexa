import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateFavorite, updateRating, updateWatchlist } from './account.api'
import type { AccountStates, TitleMediaType } from '@/types/tmdb'
import { useAuthStore } from '@/features/auth/auth.store'
import { accountStatesOptions } from './account.queries'

type StateInput = {
  mediaType: TitleMediaType
  id: number
  field: 'favorite' | 'watchlist'
  value: boolean
}

export function useAccountStateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['account-state'],
    mutationFn: ({ mediaType, id, field, value }: StateInput) => {
      const accountId = useAuthStore.getState().accountId
      if (!accountId)
        throw new Error('Your TMDB session is no longer available.')
      return field === 'favorite'
        ? updateFavorite(accountId, mediaType, id, value)
        : updateWatchlist(accountId, mediaType, id, value)
    },
    onMutate: async ({ mediaType, id, field, value }) => {
      const key = accountStatesOptions(mediaType, id).queryKey
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<AccountStates>(key)
      queryClient.setQueryData<AccountStates>(key, (current) =>
        current ? { ...current, [field]: value } : current,
      )
      return { key, previous }
    },
    onError: (_error, input, context) => {
      if (context?.previous)
        queryClient.setQueryData(
          accountStatesOptions(input.mediaType, input.id).queryKey,
          context.previous,
        )
    },
    onSettled: (_data, _error, input) => {
      void queryClient.invalidateQueries({
        queryKey: accountStatesOptions(input.mediaType, input.id).queryKey,
      })
      void queryClient.invalidateQueries({
        queryKey: accountStatesOptions(input.mediaType, input.id).queryKey,
      })
    },
  })
}

export function useRatingMutation(mediaType: TitleMediaType, id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['account-rating', mediaType, id],
    mutationFn: (value: number | null) => updateRating(mediaType, id, value),
    onMutate: async (value) => {
      const key = accountStatesOptions(mediaType, id).queryKey
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<AccountStates>(key)
      queryClient.setQueryData<AccountStates>(key, (current) =>
        current
          ? { ...current, rated: value === null ? false : { value } }
          : current,
      )
      return { key, previous }
    },
    onError: (_error, _value, context) => {
      if (context?.previous)
        queryClient.setQueryData(
          accountStatesOptions(mediaType, id).queryKey,
          context.previous,
        )
    },
  })
}
