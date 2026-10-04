import { endpoints, v4Endpoints } from '@/lib/tmdb/endpoints'
import {
  tmdbDelete,
  tmdbGet,
  tmdbSend,
  tmdbV4Get,
  tmdbV4Send,
} from '@/lib/tmdb/client'
import { getSessionId, useAuthStore } from '@/features/auth/auth.store'
import type {
  AccountMediaList,
  AccountStates,
  AuthResponse,
  CreateListResponse,
  ListDetail,
  ListList,
  TitleMediaType,
} from '@/types/tmdb'

export function getAccountMediaList(
  accountId: number,
  kind: 'watchlist' | 'favorite' | 'rated',
  mediaType: TitleMediaType,
  page: number,
) {
  return tmdbGet<AccountMediaList>(
    endpoints.accountMediaList(accountId, kind, mediaType),
    { params: { page }, sessionId: getSessionId() },
  )
}

export function getAccountLists(accountId: number, page: number) {
  return tmdbGet<ListList>(endpoints.accountLists(accountId), {
    params: { page },
    sessionId: getSessionId(),
  })
}

export function getList(id: number) {
  return tmdbV4Get<ListDetail>(endpoints.list(id), {
    bearerToken: useAuthStore.getState().v4AccessToken,
  })
}

export function getAccountStates(mediaType: TitleMediaType, id: number) {
  return tmdbGet<AccountStates>(endpoints.accountStates(mediaType, id), {
    sessionId: getSessionId(),
  })
}

export function getRecommendations(
  accountObjectId: string,
  mediaType: TitleMediaType,
  page: number,
  bearerToken: string,
) {
  return tmdbV4Send<AccountMediaList>(
    v4Endpoints.recommendations(accountObjectId, mediaType),
    {
      body: { page },
      bearerToken,
    },
  )
}

export function updateFavorite(
  accountId: number,
  mediaType: TitleMediaType,
  mediaId: number,
  favorite: boolean,
) {
  return tmdbSend<AuthResponse>(endpoints.favorite(accountId), {
    body: { media_type: mediaType, media_id: mediaId, favorite },
  })
}

export function updateWatchlist(
  accountId: number,
  mediaType: TitleMediaType,
  mediaId: number,
  watchlist: boolean,
) {
  return tmdbSend<AuthResponse>(endpoints.watchlist(accountId), {
    body: { media_type: mediaType, media_id: mediaId, watchlist },
  })
}

export function updateRating(
  mediaType: TitleMediaType,
  mediaId: number,
  value: number | null,
) {
  if (value === null)
    return tmdbDelete<AuthResponse>(endpoints.rateTitle(mediaType, mediaId))
  return tmdbSend<AuthResponse>(endpoints.rateTitle(mediaType, mediaId), {
    body: { value },
  })
}

export function createList(body: {
  name: string
  description: string
  language: string
}) {
  return tmdbSend<CreateListResponse>(endpoints.createList(), { body })
}

export function deleteList(id: number) {
  return tmdbDelete<AuthResponse>(endpoints.deleteList(id))
}

export function clearList(id: number) {
  return tmdbSend<AuthResponse>(endpoints.clearList(id), {
    body: {},
    params: { confirm: true },
  })
}

export function addListItem(listId: number, mediaId: number) {
  return tmdbSend<AuthResponse>(endpoints.addListItem(listId), {
    body: { media_id: mediaId },
  })
}

export function removeListItem(listId: number, mediaId: number) {
  return tmdbSend<AuthResponse>(endpoints.removeListItem(listId), {
    body: { media_id: mediaId },
  })
}
