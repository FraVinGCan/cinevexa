import { cn } from 'cn'
import { StarIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatVoteCount } from '@/lib/tmdb/format'

type RatingBadgeProps = {
  value: number
  voteCount?: number
  className?: string
}

export function RatingBadge({ value, voteCount, className }: RatingBadgeProps) {
  if (!Number.isFinite(value) || value <= 0) return null

  return (
    <Badge className={cn('bg-muted text-foreground tabular-nums', className)}>
      <StarIcon className="fill-score text-score" />
      <span className="sr-only">TMDB score </span>
      {value.toFixed(1)}
      {voteCount !== undefined && voteCount > 0 && (
        <span className="sr-only">
          {' '}
          out of {formatVoteCount(voteCount)} votes
        </span>
      )}
    </Badge>
  )
}
