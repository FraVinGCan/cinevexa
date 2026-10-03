import { Navigate } from 'react-router'

/** `/discover` has no media type of its own, so it lands on films. */
export function Component() {
  return <Navigate to="/discover/movies" replace />
}
