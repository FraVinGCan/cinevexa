import { Component, type ErrorInfo, type ReactNode } from 'react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { ErrorState } from '@/components/feedback/error-state'
import { Button } from '@/components/ui/button'

const CHUNK_ERROR_PATTERN =
  /failed to fetch dynamically imported module|error loading dynamically imported module|loading (?:css )?chunk \d+ failed|chunkloaderror|error loading dynamically imported module|importing a module script failed/i

function isChunkError(error: unknown): boolean {
  if (error instanceof Error) return CHUNK_ERROR_PATTERN.test(error.message)
  return typeof error === 'string' && CHUNK_ERROR_PATTERN.test(error)
}

export function RouteErrorFallback() {
  const error = useRouteError()
  const routeError = isRouteErrorResponse(error)
    ? {
        title: routeTitleFor(error.status),
        message: error.statusText || 'This route could not be loaded.',
      }
    : null

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 py-16">
      <ErrorState
        error={error}
        title={routeError?.title}
        message={routeError?.message}
        action={{ label: 'Back to the index', to: '/' }}
      />
      <Button variant="outline" onClick={() => window.location.reload()}>
        Reload the page
      </Button>
    </div>
  )
}

function routeTitleFor(status: number): string {
  if (status === 404) return 'Not in the index'
  if (status >= 500) return 'TMDB is unavailable'
  return 'This route could not be loaded'
}

type AppErrorBoundaryProps = {
  children: ReactNode
}

type AppErrorBoundaryState = {
  error: Error | null
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  override state: AppErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    return {
      error:
        error instanceof Error ? error : new Error('Unknown render failure'),
    }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[cinevexa] render failure:', error, info.componentStack)
  }

  private readonly handleRetry = (): void => {
    if (isChunkError(this.state.error)) {
      window.location.reload()
      return
    }
    this.setState({ error: null })
  }

  override render(): ReactNode {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-4 py-16">
        <ErrorState
          error={error}
          title={
            isChunkError(error)
              ? 'A part of Cinevexa failed to load'
              : 'Cinevexa hit an error'
          }
          message={
            isChunkError(error)
              ? 'This build was replaced while the page was open, so a lazy chunk could not be fetched. Reload to pick up the current version.'
              : 'An unexpected render failure stopped this page. Reload to try again.'
          }
          retryLabel="Reload"
          onRetry={this.handleRetry}
          action={{ label: 'Back to the index', to: '/' }}
        />
        <Button nativeButton={false} variant="ghost" render={<Link to="/" />}>
          Go home without reloading
        </Button>
      </div>
    )
  }
}
