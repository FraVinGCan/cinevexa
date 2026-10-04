import { queryOptions } from '@tanstack/react-query'
import {
  getAccountMediaList,
  getAccountLists,
  getAccountStates,
  getList,
  getRecommendations,
} from './account.api'
import type { TitleMediaType } from '@/types/tmdb'

export const accountMediaOptions = (
  accountId: number,
  kind: 'watchlist' | 'favorite' | 'rated',
  mediaType: TitleMediaType,
  page: number,
) =>
  queryOptions({
    queryKey: ['account', kind, mediaType, page, accountId],
    queryFn: () => getAccountMediaList(accountId, kind, mediaType, page),
    staleTime: 5 * 60 * 1000,
  })

export const accountStatesOptions = (mediaType: TitleMediaType, id: number) =>
  queryOptions({
    queryKey: ['account-state', mediaType, id],
    queryFn: () => getAccountStates(mediaType, id),
    staleTime: 0,
  })

export const accountListsOptions = (accountId: number, page = 1) =>
  queryOptions({
    queryKey: ['account', 'lists', page, accountId],
    queryFn: () => getAccountLists(accountId, page),
    staleTime: 5 * 60 * 1000,
  })

export const listOptions = (id: number) =>
  queryOptions({
    queryKey: ['list', id],
    queryFn: () => getList(id),
    staleTime: 5 * 60 * 1000,
  })

export const recommendationsOptions = (
  accountObjectId: string,
  mediaType: TitleMediaType,
  page: number,
  bearerToken: string,
) =>
  queryOptions({
    queryKey: [
      'recommendations',
      mediaType,
      page,
      accountObjectId,
      bearerToken,
    ],
    queryFn: () =>
      getRecommendations(accountObjectId, mediaType, page, bearerToken),
    staleTime: 10 * 60 * 1000,
  })
