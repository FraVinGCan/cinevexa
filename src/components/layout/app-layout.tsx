import { Suspense, useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { AppFooter } from './app-footer'
import { AppHeader } from './app-header'
import { RouteSkeleton } from '@/components/feedback/route-skeleton'

function ScrollToTop() {
  const { pathname } = useLocation()
  const previous = useRef(pathname)

  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <ScrollToTop />
      <ScrollRestoration />
      <a
        href="#main"
        className="sr-only rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:ring-3 focus:ring-ring/30 focus:outline-none">
        Skip to content
      </a>
      <AppHeader />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={<RouteSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <AppFooter />
    </div>
  )
}
