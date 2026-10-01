export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export type PosterSize = 'grid' | 'detail' | 'lightbox'
export type BackdropSize = 'rail' | 'hero'
export type ProfileSize = 'list' | 'lightbox'
export type StillSize = 'card'
export type LogoSize = 'provider'

export const posterSizes: Record<PosterSize, string> = {
  grid: 'w342',
  detail: 'w500',
  lightbox: 'original',
}

export const backdropSizes: Record<BackdropSize, string> = {
  rail: 'w780',
  hero: 'w1280',
}

export const profileSizes: Record<ProfileSize, string> = {
  list: 'w185',
  lightbox: 'original',
}

export const stillSizes: Record<StillSize, string> = {
  card: 'w300',
}

export const logoSizes: Record<LogoSize, string> = {
  provider: 'w154',
}

export function imageUrl(
  path: string | null | undefined,
  size: string,
): string | null {
  if (path === null || path === undefined || path.trim() === '') return null
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function posterUrl(
  path: string | null | undefined,
  size: PosterSize,
): string | null {
  return imageUrl(path, posterSizes[size])
}

export function backdropUrl(
  path: string | null | undefined,
  size: BackdropSize,
): string | null {
  return imageUrl(path, backdropSizes[size])
}

export function profileUrl(
  path: string | null | undefined,
  size: ProfileSize,
): string | null {
  return imageUrl(path, profileSizes[size])
}

export function stillUrl(
  path: string | null | undefined,
  size: StillSize = 'card',
): string | null {
  return imageUrl(path, stillSizes[size])
}

export function logoUrl(
  path: string | null | undefined,
  size: LogoSize = 'provider',
): string | null {
  return imageUrl(path, logoSizes[size])
}
