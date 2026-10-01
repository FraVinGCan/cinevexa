import { useMatches } from 'react-router'

export type NavItem = {
  to: string
  label: string
  end?: boolean
}

export const primaryNav: NavItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/discover/movies', label: 'Movies' },
  { to: '/discover/tv', label: 'TV' },
  { to: '/search', label: 'Search' },
  { to: '/lists', label: 'Lists' },
  { to: '/account', label: 'My Library' },
]

export type RouteHandle = {
  title: string
}

function handleTitle(handle: unknown): string | undefined {
  if (typeof handle !== 'object' || handle === null) return undefined
  const { title } = handle as Partial<RouteHandle>
  return typeof title === 'string' ? title : undefined
}

export function usePageTitle(): string | undefined {
  const matches = useMatches()
  const titles = matches
    .map((match) => handleTitle(match.handle))
    .filter((title) => title !== undefined)
  return titles.at(-1)
}
