import type { ReactNode } from 'react'
import { castOf, crewByDepartment, type DetailSource } from '../detail'
import { CastList } from '@/components/cast/cast-list'
import { CrewList } from '@/components/cast/crew-list'
import { DetailSection } from '@/components/detail/detail-section'
import { MediaGallery } from '@/components/gallery/media-gallery'
import { titleGalleryItemsOf } from '@/components/gallery/gallery-items'
import { MediaGrid } from '@/components/media/media-grid'
import { PosterCard } from '@/components/media/poster-card'
import { ReviewList } from '@/components/reviews/review-list'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Credits, Review, TitleListItem } from '@/types/tmdb'

type TitleDetailSectionsProps = {
  title: string
  detail: DetailSource
  credits: Credits | undefined
  reviews: Review[]
  recommendations: TitleListItem[]
  similar: TitleListItem[]
  /** Appended below the shared shelves by the page that owns the route. */
  children?: ReactNode
}

/**
 * Everything a film and a series share, in the order a reader arrives at it: who
 * made it, what it looks like, what people wrote, then what to watch next. A
 * shelf TMDB published nothing for is omitted rather than shown empty, so a
 * heading never sits above nothing.
 */
export function TitleDetailSections({
  title,
  detail,
  credits,
  reviews,
  recommendations,
  similar,
  children,
}: TitleDetailSectionsProps) {
  const cast = castOf(credits)
  const crew = crewByDepartment(credits)
  const images = titleGalleryItemsOf(detail.images, title)
  const videos = detail.videos?.results ?? []
  const people = cast.length + crew.reduce((sum, g) => sum + g.jobs.length, 0)

  return (
    <>
      {people > 0 && (
        <DetailSection label="Credits" heading="Who made it">
          <Tabs defaultValue={cast.length > 0 ? 'cast' : 'crew'}>
            <TabsList variant="line">
              {cast.length > 0 && (
                <TabsTrigger value="cast" className="min-h-11">
                  Cast
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {cast.length}
                  </span>
                </TabsTrigger>
              )}
              {crew.length > 0 && (
                <TabsTrigger value="crew" className="min-h-11">
                  Crew
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {crew.reduce((sum, g) => sum + g.jobs.length, 0)}
                  </span>
                </TabsTrigger>
              )}
            </TabsList>

            {cast.length > 0 && (
              <TabsContent value="cast" className="mt-4">
                <CastList cast={cast} />
              </TabsContent>
            )}
            {crew.length > 0 && (
              <TabsContent value="crew" className="mt-4">
                <CrewList departments={crew} />
              </TabsContent>
            )}
          </Tabs>
        </DetailSection>
      )}

      <DetailSection
        label="Gallery"
        heading="Artwork and trailers"
        action={
          <p className="text-xs text-muted-foreground tabular-nums">
            {images.length} {images.length === 1 ? 'frame' : 'frames'} ·{' '}
            {videos.length} {videos.length === 1 ? 'video' : 'videos'}
          </p>
        }>
        <MediaGallery
          title={title}
          images={images}
          videos={videos}
          emptyLabel={`TMDB has no artwork or trailer for ${title}.`}
        />
      </DetailSection>

      <DetailSection
        label="Reviews"
        heading="What people wrote"
        action={
          reviews.length > 0 ? (
            <p className="text-xs text-muted-foreground tabular-nums">
              {reviews.length} on TMDB
            </p>
          ) : null
        }>
        <ReviewList reviews={reviews} title={title} />
      </DetailSection>

      {recommendations.length > 0 && (
        <DetailSection label="Recommended" heading="Because you read this one">
          <MediaGrid>
            {recommendations.slice(0, 8).map((item) => (
              <PosterCard key={item.id} item={item} />
            ))}
          </MediaGrid>
        </DetailSection>
      )}

      {similar.length > 0 && (
        <DetailSection label="Similar" heading="More like this">
          <MediaGrid>
            {similar.slice(0, 8).map((item) => (
              <PosterCard key={item.id} item={item} />
            ))}
          </MediaGrid>
        </DetailSection>
      )}

      {children !== undefined && children !== null && (
        <>
          <Separator />
          {children}
        </>
      )}
    </>
  )
}
