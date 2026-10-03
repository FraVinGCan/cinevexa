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
        path: 'keyword',
        lazy: () => import('@/routes/keyword-search'),
        handle: { title: 'Themes' },
      },
      {
        path: 'keyword/:id',
        lazy: () => import('@/routes/keyword-detail'),
        handle: { title: 'Theme' },
      },
      {
        path: 'movie/:id',
        lazy: () => import('@/routes/movie-detail'),
        handle: { title: 'Film' },
      },
      {
        path: 'tv/:id',
        lazy: () => import('@/routes/tv-detail'),
        handle: { title: 'Series' },
      },
      {
        path: 'tv/:id/season/:seasonNumber',
        lazy: () => import('@/routes/tv-season'),
        handle: { title: 'Season' },
      },
      {
        path: 'person/:id',
        lazy: () => import('@/routes/person-detail'),
        handle: { title: 'Person' },
      },
      {
        path: 'collection/:id',
        lazy: () => import('@/routes/collection-detail'),
        handle: { title: 'Collection' },
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
