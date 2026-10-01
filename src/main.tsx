import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppProviders } from './app/providers'
import { AppErrorBoundary } from './app/error-boundary'
import { router } from './app/router'
import './css/main.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <AppErrorBoundary>
        <RouterProvider router={router} />
      </AppErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </AppProviders>
  </StrictMode>,
)
