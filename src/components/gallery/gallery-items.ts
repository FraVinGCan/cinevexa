import type { DetailSource } from '@/features/catalog/detail'
import type { BackdropImage, PosterImage, ProfileImage } from '@/types/tmdb'

export type GalleryKind = 'backdrop' | 'poster' | 'profile' | 'still'

export type GalleryItem = {
  id: string
  kind: GalleryKind
  path: string
  alt: string
  /** The intrinsic box, so the frame holds its shape while the image lands. */
  width: number
  height: number
}

/**
 * A title's artwork arrives as one unsorted set of backdrops and posters. The
 * order here is the one TMDB sends them in, which is by vote and language, so the
 * strongest frame for the reader's market tends to lead.
 */
export function titleGalleryItemsOf(
  images: DetailSource['images'],
  title: string,
): GalleryItem[] {
  const backdrops: GalleryItem[] = (images?.backdrops ?? []).map(
    (image: BackdropImage) => ({
      id: `backdrop-${image.file_path}`,
      kind: 'backdrop',
      path: image.file_path,
      alt: `${title} backdrop`,
      width: image.width,
      height: image.height,
    }),
  )
  const posters: GalleryItem[] = (images?.posters ?? []).map(
    (image: PosterImage) => ({
      id: `poster-${image.file_path}`,
      kind: 'poster',
      path: image.file_path,
      alt: `${title} poster`,
      width: image.width,
      height: image.height,
    }),
  )
  return [...backdrops, ...posters]
}

export function personGalleryItemsOf(
  profiles: ProfileImage[] | undefined,
  name: string,
): GalleryItem[] {
  return (profiles ?? []).map((image) => ({
    id: `profile-${image.file_path}`,
    kind: 'profile',
    path: image.file_path,
    alt: `${name} portrait`,
    width: image.width,
    height: image.height,
  }))
}

export function episodeGalleryItemsOf(
  stillPath: string | null,
  label: string,
): GalleryItem[] {
  if (stillPath === null) return []
  return [
    {
      id: `still-${stillPath}`,
      kind: 'still',
      path: stillPath,
      alt: `${label} still`,
      width: 1920,
      height: 1080,
    },
  ]
}

/**
 * A season's stills belong to their episodes, so each frame keeps the name of the
 * episode that contributed it. TMDB reuses one still across every episode of a
 * season often enough to be the norm rather than the exception, so frames are
 * deduplicated by path — otherwise the shelf fills with copies of one image.
 */
export function seasonStillsOf(
  episodes: readonly { name: string; still_path: string | null }[],
): GalleryItem[] {
  const seen = new Set<string>()
  const items: GalleryItem[] = []
  for (const episode of episodes) {
    if (episode.still_path === null || seen.has(episode.still_path)) continue
    seen.add(episode.still_path)
    items.push(...episodeGalleryItemsOf(episode.still_path, episode.name))
  }
  return items
}
