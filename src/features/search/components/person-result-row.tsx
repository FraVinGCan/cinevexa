import { Link } from 'react-router'
import { MediaPoster } from '@/components/media/media-poster'
import { titleOf } from '@/lib/tmdb/format'
import { profileDimensions, profileUrl } from '@/lib/tmdb/image'
import { titleCase } from '../search.schema'
import type { PersonListItem, TitleListItem } from '@/types/tmdb'

type PersonResultRowProps = {
  person: PersonListItem
}

/**
 * The most prominent credit a person is known for, which is what makes a name
 * in a result list recognisable rather than just a name to look up.
 */
function leadCreditOf(person: PersonListItem): TitleListItem | null {
  const [first] = person.known_for
  if (first === undefined) return null
  return person.known_for.reduce<TitleListItem>(
    (best, candidate) =>
      candidate.popularity > best.popularity ? candidate : best,
    first,
  )
}

export function PersonResultRow({ person }: PersonResultRowProps) {
  const lead = leadCreditOf(person)

  return (
    <Link
      to={`/person/${person.id}`}
      className="flex items-center gap-4 rounded-4xl bg-card p-3 shadow-md ring-1 ring-foreground/5 transition-colors hover:bg-surface-raised focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none dark:ring-foreground/10">
      <MediaPoster
        src={profileUrl(person.profile_path, 'list')}
        {...profileDimensions.list}
        className="aspect-2/3 w-14 shrink-0 rounded-xl"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="line-clamp-1 font-heading text-sm font-medium text-card-foreground">
          {person.name}
        </h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {person.known_for_department !== ''
            ? titleCase(person.known_for_department)
            : 'Cast and crew'}
          {lead !== null && ` · ${titleOf(lead)}`}
        </p>
      </div>
    </Link>
  )
}
