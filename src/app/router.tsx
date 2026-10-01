import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppLayout } from '@/components/layout/app-layout'
import { RouteSkeleton } from '@/components/feedback/route-skeleton'
import { RouteErrorFallback } from './error-boundary'

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
        path: '*',
        lazy: () => import('@/routes/not-found'),
        handle: { title: 'Not in the index' },
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
