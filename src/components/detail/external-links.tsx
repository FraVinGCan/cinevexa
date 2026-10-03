import { ArrowUpRightIcon } from 'lucide-react'
import type { ExternalLink } from '@/features/catalog/detail'

type ExternalLinksProps = {
  links: ExternalLink[]
  className?: string
}

/**
 * Where the rest of this title lives. Every destination is one TMDB returned an
 * id for, so the row disappears rather than offering a link that goes nowhere.
 */
export function ExternalLinks({ links, className }: ExternalLinksProps) {
  if (links.length === 0) return null

  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
            {link.label}
            <ArrowUpRightIcon aria-hidden className="size-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
