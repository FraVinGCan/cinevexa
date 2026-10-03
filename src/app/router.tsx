import {
  createBrowserRouter,
  type LoaderFunctionArgs,
  type RouteObject,
} from 'react-router'
import { AppLayout } from '@/components/layout/app-layout'
import { RouteSkeleton } from '@/components/feedback/route-skeleton'
import { RouteErrorFallback } from './error-boundary'
import { isDiscoverSegment } from '@/features/discover/discover.schema'

/** `/discover/people` and `/discover/audio` are addresses TMDB cannot serve. */
function assertDiscoverSegment({ params }: LoaderFunctionArgs) {
  if (isDiscoverSegment(params.mediaType)) return null
  throw new Response('Not in the index', {
    status: 404,
    statusText: 'Not in the index',
  })
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    HydrateFallback: RouteSkeleton,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        lazy: () => import('@/routes/home'),
        handle: { title: 'Index' },
      },
      {
        path: 'discover',
        lazy: () => import('@/routes/discover-redirect'),
        handle: { title: 'Discover' },
      },
      {
        path: 'discover/:mediaType',
        loader: assertDiscoverSegment,
        lazy: () => import('@/routes/discover'),
        handle: { title: 'Discover' },
      },
      {
        path: 'search',
        lazy: () => import('@/routes/search'),
        handle: { title: 'Search' },
      },
      {
        path: '*',
        lazy: () => import('@/routes/not-found'),
        handle: { title: 'Not in the index' },
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
