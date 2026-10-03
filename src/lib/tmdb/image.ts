export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export type PosterSize = 'thumb' | 'grid' | 'detail' | 'lightbox'
export type BackdropSize = 'rail' | 'hero'
export type ProfileSize = 'list' | 'lightbox'
export type StillSize = 'card'
export type LogoSize = 'provider'

export type ArtworkSize = {
  width: number
  height: number
}

export const posterSizes: Record<PosterSize, string> = {
  thumb: 'w154',
  grid: 'w342',
  detail: 'w500',
  lightbox: 'original',
}

export const posterDimensions: Record<PosterSize, ArtworkSize> = {
  thumb: { width: 154, height: 231 },
  grid: { width: 342, height: 513 },
  detail: { width: 500, height: 750 },
  lightbox: { width: 2000, height: 3000 },
}

export const backdropSizes: Record<BackdropSize, string> = {
  rail: 'w780',
  hero: 'w1280',
}

export const backdropDimensions: Record<BackdropSize, ArtworkSize> = {
  rail: { width: 780, height: 439 },
  hero: { width: 1280, height: 720 },
}

export const profileSizes: Record<ProfileSize, string> = {
  list: 'w185',
  lightbox: 'original',
}

export const profileDimensions: Record<ProfileSize, ArtworkSize> = {
  list: { width: 185, height: 278 },
  lightbox: { width: 1000, height: 1500 },
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
