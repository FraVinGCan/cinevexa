import { cn } from 'cn'
import { useImageLoadState } from '@/lib/hooks/useImageLoadState'
import { Skeleton } from '@/components/ui/skeleton'

type MediaPosterProps = {
  src: string | null
  width: number
  height: number
  alt?: string
  priority?: boolean
  className?: string
  imageClassName?: string
}

function ArtworkPlaceholder() {
  return (
    <div className="flex size-full flex-col items-center justify-center bg-surface-raised">
      <img
        src="/favicon.svg"
        alt=""
        aria-hidden
        width={24}
        height={24}
        className="size-6 opacity-40"
      />
      <span className="sr-only">No artwork available</span>
    </div>
  )
}

export function MediaPoster({
  src,
  width,
  height,
  alt = '',
  priority = false,
  className,
  imageClassName,
}: MediaPosterProps) {
  const { loaded, failed, attach, onLoad, onError } = useImageLoadState()
  const showImage = src !== null && !failed

  return (
    <div
      className={cn('relative overflow-hidden bg-surface-raised', className)}>
      {showImage ? (
        <>
          {!loaded && (
            <Skeleton aria-hidden className="absolute inset-0 rounded-none" />
          )}
          <img
            ref={attach}
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            onLoad={onLoad}
            onError={onError}
            className={cn(
              'size-full object-cover transition-opacity duration-300 motion-reduce:transition-none',
              loaded ? 'opacity-100' : 'opacity-0',
              imageClassName,
            )}
          />
        </>
      ) : (
        <ArtworkPlaceholder />
      )}
    </div>
  )
}
