import { useMemo } from 'react'
import { Link } from 'react-router'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from 'cn'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'

const WINDOW = 2

function pageWindow(current: number, total: number): (number | 'gap')[] {
  if (total <= 0) return []
  const pages = new Set<number>([1, total, current])
  for (let page = current - WINDOW; page <= current + WINDOW; page += 1) {
    if (page >= 1 && page <= total) pages.add(page)
  }
  const entries: (number | 'gap')[] = []
  let previous = 0
  for (const page of [...pages].sort((left, right) => left - right)) {
    if (previous !== 0 && page - previous > 1) entries.push('gap')
    entries.push(page)
    previous = page
  }
  return entries
}

type PageLinkProps = {
  to: string
  page: number
  isActive: boolean
}

/**
 * A page number is navigation, so these stay real links rather than Base UI
 * buttons: the router intercepts them, and middle-click and copy-link work.
 *
 * Scroll restoration is suppressed because moving between result pages should
 * not throw the reader back to the top of a long grid.
 */
function PageLink({ to, page, isActive }: PageLinkProps) {
  return (
    <Link
      to={to}
      preventScrollReset
      aria-label={`Page ${page}`}
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      className={buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size: 'icon',
      })}>
      {page}
    </Link>
  )
}

type EdgeLinkProps = {
  to: string | null
  label: string
  icon: 'previous' | 'next'
}

function EdgeLink({ to, label, icon }: EdgeLinkProps) {
  const Icon = icon === 'previous' ? ChevronLeftIcon : ChevronRightIcon
  const content = (
    <>
      {icon === 'previous' && <Icon data-icon="inline-start" />}
      <span className="hidden sm:block">{label}</span>
      {icon === 'next' && <Icon data-icon="inline-end" />}
    </>
  )
  if (to === null) {
    return (
      <Button variant="ghost" size="default" disabled>
        {content}
      </Button>
    )
  }
  return (
    <Link
      to={to}
      preventScrollReset
      aria-label={`Go to ${label.toLowerCase()} page`}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'default' }),
        icon === 'previous' ? 'pl-2!' : 'pr-2!',
      )}>
      {content}
    </Link>
  )
}

type NumberedPaginationProps = {
  page: number
  totalPages: number
  buildHref: (page: number) => string
  className?: string
}

/**
 * Every number is a router link rather than a click handler, so the address bar
 * always describes the page on screen and the back button steps through results.
 */
export function NumberedPagination({
  page,
  totalPages,
  buildHref,
  className,
}: NumberedPaginationProps) {
  const current = Math.min(Math.max(page, 1), Math.max(totalPages, 1))
  const entries = useMemo(
    () => pageWindow(current, totalPages),
    [current, totalPages],
  )

  if (totalPages <= 1) return null

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <EdgeLink
            to={current <= 1 ? null : buildHref(current - 1)}
            label="Previous"
            icon="previous"
          />
        </PaginationItem>
        {entries.map((entry, index) =>
          entry === 'gap' ? (
            <PaginationItem key={`gap-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={entry}>
              <PageLink
                to={buildHref(entry)}
                page={entry}
                isActive={entry === current}
              />
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <EdgeLink
            to={current >= totalPages ? null : buildHref(current + 1)}
            label="Next"
            icon="next"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
