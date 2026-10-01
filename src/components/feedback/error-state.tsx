import { Link } from 'react-router'
import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { describeError } from '@/lib/tmdb/errors'

type ErrorStateProps = {
  error: unknown
  onRetry?: () => void
  title?: string
  message?: string
  retryLabel?: string
  action?: { label: string; to: string }
  className?: string
}

export function ErrorState({
  error,
  onRetry,
  title,
  message,
  retryLabel = 'Retry',
  action = { label: 'Browse movies', to: '/discover/movies' },
  className,
}: ErrorStateProps) {
  const described = describeError(error)
  const heading = title ?? described.title
  const copy = message ?? described.message

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircleIcon />
      <AlertTitle>{heading}</AlertTitle>
      <AlertDescription>{copy}</AlertDescription>
      {(onRetry || action) && (
        <div className="col-start-2 mt-3 flex flex-wrap items-center gap-2">
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCwIcon />
              {retryLabel}
            </Button>
          )}
          <Button variant="ghost" size="sm" render={<Link to={action.to} />}>
            {action.label}
          </Button>
        </div>
      )}
    </Alert>
  )
}
