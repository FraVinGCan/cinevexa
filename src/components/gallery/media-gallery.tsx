import { useCallback, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MediaPoster } from '@/components/media/media-poster'
import type { GalleryItem } from './gallery-items'
import { videoEmbedUrl, videoWatchUrl } from '@/features/catalog/detail'
import {
  backdropDimensions,
  imageUrl,
  originalUrl,
  posterDimensions,
  posterUrl,
  profileDimensions,
  profileUrl,
  stillUrl,
} from '@/lib/tmdb/image'
import type { Video } from '@/types/tmdb'

const STILL_DIMENSIONS = { width: 300, height: 169 }

type Selection =
  { kind: 'image'; index: number } | { kind: 'video'; video: Video }

type MediaGalleryProps = {
  title: string
  images: GalleryItem[]
  videos: Video[]
  emptyLabel: string
}

const BACKDROP_CARD = 'w-64 shrink-0 snap-start sm:w-80'
const PORTRAIT_CARD = 'w-36 shrink-0 snap-start'
const VIDEO_CARD = 'w-72 shrink-0 snap-start'

const THUMB_DIMENSIONS = {
  backdrop: backdropDimensions.rail,
  poster: posterDimensions.grid,
  profile: profileDimensions.list,
  still: STILL_DIMENSIONS,
} as const

function thumbSrc(item: GalleryItem): string | null {
  switch (item.kind) {
    case 'poster':
      return posterUrl(item.path, 'grid')
    case 'profile':
      return profileUrl(item.path, 'list')
    case 'still':
      return stillUrl(item.path)
    case 'backdrop':
      return imageUrl(item.path, 'w780')
  }
}

/** A poster, portrait, or still keeps its own ratio; everything else is 16:9. */
function thumbRatio(kind: GalleryItem['kind']): string {
  return kind === 'poster' || kind === 'profile' ? 'aspect-2/3' : 'aspect-16/9'
}

/**
 * Artwork and trailers in one horizontal band, opened one at a time in a dialog.
 * A title's backdrops, posters, and trailers all arrive in the same request as
 * the page itself, so the gallery reads data already held rather than fetching a
 * second surface. TMDB publishes no thumbnail for a trailer, so a trailer cell is
 * a designed frame with a play mark rather than a broken image.
 */
export function MediaGallery({
  title,
  images,
  videos,
  emptyLabel,
}: MediaGalleryProps) {
  const [selection, setSelection] = useState<Selection | null>(null)

  const step = useCallback(
    (delta: number) => {
      setSelection((current) => {
        if (current === null || current.kind !== 'image') return current
        if (images.length === 0) return current
        return {
          kind: 'image',
          index: (current.index + delta + images.length) % images.length,
        }
      })
    },
    [images.length],
  )

  const image =
    selection?.kind === 'image' ? (images[selection.index] ?? null) : null
  const video = selection?.kind === 'video' ? selection.video : null

  return (
    <>
      {images.length === 0 && videos.length === 0 ? (
        <p className="rounded-2xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      ) : (
        <div
          role="group"
          aria-label={`${title} artwork and trailers`}
          tabIndex={0}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain contain-paint pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/35 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
          {images.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelection({ kind: 'image', index })}
              aria-label={`Open ${item.alt}`}
              className={
                item.kind === 'poster' || item.kind === 'profile'
                  ? PORTRAIT_CARD
                  : BACKDROP_CARD
              }>
              <MediaPoster
                src={thumbSrc(item)}
                {...THUMB_DIMENSIONS[item.kind]}
                className={`${thumbRatio(item.kind)} w-full rounded-4xl`}
              />
            </button>
          ))}
          {videos.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setSelection({ kind: 'video', video: entry })}
              aria-label={`Play ${entry.name}`}
              className={`${VIDEO_CARD} group/video flex flex-col overflow-hidden rounded-4xl bg-card text-left shadow-md ring-1 ring-foreground/5 transition-colors hover:bg-surface-raised focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none dark:ring-foreground/10`}>
              <span className="flex aspect-16/9 w-full items-center justify-center bg-surface-raised">
                <span className="flex size-12 items-center justify-center rounded-full bg-black/55 text-white transition-transform duration-200 group-hover/video:scale-105 motion-reduce:transition-none">
                  <PlayIcon className="size-5" />
                </span>
              </span>
              <span className="flex flex-col gap-0.5 px-3 py-2.5">
                <span className="line-clamp-1 text-sm font-medium text-card-foreground">
                  {entry.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {entry.type}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      <Dialog
        open={selection !== null}
        onOpenChange={(open) => {
          if (!open) setSelection(null)
        }}>
        <DialogContent
          className="sm:max-w-3xl"
          onKeyDown={(event) => {
            // A reader stepping through frames expects the arrow keys, not only
            // the two buttons, so stepping is bound to the dialog itself.
            if (images.length < 2) return
            if (event.key === 'ArrowRight') {
              event.preventDefault()
              step(1)
            } else if (event.key === 'ArrowLeft') {
              event.preventDefault()
              step(-1)
            }
          }}>
          <DialogHeader>
            <DialogTitle>
              {image !== null ? image.alt : video?.name}
            </DialogTitle>
            <DialogDescription>
              {image !== null
                ? `TMDB artwork for ${title}`
                : video !== null
                  ? `${video.type} published by TMDB`
                  : ''}
            </DialogDescription>
          </DialogHeader>

          {image !== null ? (
            <>
              <img
                src={originalUrl(image.path)}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="max-h-[68dvh] w-full rounded-2xl bg-surface-raised object-contain"
              />
              {images.length > 1 && (
                <div className="flex items-center justify-between gap-2">
                  <Button variant="outline" onClick={() => step(-1)}>
                    <ChevronLeftIcon />
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {`${selectionIndex(selection)} of ${images.length}`}
                  </span>
                  <Button variant="outline" onClick={() => step(1)}>
                    Next
                    <ChevronRightIcon />
                  </Button>
                </div>
              )}
            </>
          ) : video !== null ? (
            <div className="flex flex-col gap-3">
              <div className="aspect-16/9 w-full overflow-hidden rounded-2xl bg-surface-raised">
                <iframe
                  src={videoEmbedUrl(video)}
                  title={video.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="size-full border-0"
                />
              </div>
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <a
                    href={videoWatchUrl(video)}
                    target="_blank"
                    rel="noreferrer noopener"
                  />
                }>
                Watch on YouTube
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

function selectionIndex(selection: Selection | null): number {
  return selection !== null && selection.kind === 'image'
    ? selection.index + 1
    : 1
}
