import { endpoints } from '@/lib/tmdb/endpoints'
import {
  tmdbDelete,
  tmdbGet,
  tmdbSend,
  tmdbV4Delete,
  tmdbV4Send,
} from '@/lib/tmdb/client'
import type {
  Account,
  CreateSessionResponse,
  RequestToken,
  V4AccessTokenResponse,
} from '@/types/tmdb'

export function requestV4Token(redirectTo: string): Promise<RequestToken> {
  return tmdbV4Send<RequestToken>(endpoints.v4RequestToken(), {
    body: { redirect_to: redirectTo },
  })
}

export function createV4AccessToken(
  requestTokenValue: string,
): Promise<V4AccessTokenResponse> {
  return tmdbV4Send<V4AccessTokenResponse>(endpoints.v4AccessToken(), {
    body: { request_token: requestTokenValue },
  })
}

export function convertV4Session(accessToken: string): Promise<CreateSessionResponse> {
  return tmdbSend<CreateSessionResponse>(endpoints.convertV4Session(), {
    body: { access_token: accessToken },
  })
}

export function getAccount(sessionId: string): Promise<Account> {
  return tmdbGet<Account>(endpoints.account(), { sessionId })
}

export async function deleteSession(sessionId: string): Promise<void> {
  await tmdbDelete(endpoints.deleteSession(), {
    params: { session_id: sessionId },
  })
}

export async function revokeV4AccessToken(accessToken: string): Promise<void> {
  await tmdbV4Delete(endpoints.v4RevokeAccessToken(), {
    body: { access_token: accessToken },
    bearerToken: accessToken,
  })
}
