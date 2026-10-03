import { MessageSquareIcon } from 'lucide-react'
import { EmptyState } from '@/components/feedback/empty-state'
import { RatingBadge } from '@/components/media/rating-badge'
import { formatDayMonthYear } from '@/lib/tmdb/format'
import type { Review } from '@/types/tmdb'

type ReviewListProps = {
  reviews: Review[]
  title: string
}

/**
 * Reader writing, in the order TMDB returns it: highest rated first. Each review
 * is one block with a rating, one body, and its author, so the shelf is scanned
 * down a column rather than across a wall of equal-weight quotes.
 */
export function ReviewList({ reviews, title }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareIcon}
        title="No written reviews yet"
        description={`TMDB has no review of ${title} to show.`}
      />
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="flex flex-col gap-3 rounded-4xl bg-card p-5 shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              {review.author_details.rating !== null && (
                <RatingBadge value={review.author_details.rating} />
              )}
              <Author review={review} />
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDayMonthYear(review.created_at.slice(0, 10)) ?? 'Posted'}
            </span>
          </div>
          <p className="max-w-[70ch] text-sm/relaxed text-pretty text-card-foreground">
            {review.content}
          </p>
        </li>
      ))}
    </ul>
  )
}

/**
 * TMDB publishes a display name and a username, and either can be blank. Only the
 * one a reader can read is shown, and the second line appears only when it says
 * something the first did not — an anonymous account has neither.
 */
function Author({ review }: { review: Review }) {
  const name = review.author_details.name.trim()
  const username = review.author.trim()

  if (name === '' && username === '') {
    return <span className="text-sm text-muted-foreground">Anonymous</span>
  }
  if (name === '' || name === username) {
    return (
      <span className="text-sm font-medium text-card-foreground">
        {name === '' ? username : name}
      </span>
    )
  }
  return (
    <>
      <span className="text-sm font-medium text-card-foreground">{name}</span>
      <span className="text-xs text-muted-foreground">@{username}</span>
    </>
  )
}
