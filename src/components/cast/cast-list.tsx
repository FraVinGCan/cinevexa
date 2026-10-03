import { PersonCard } from './person-card'
import type { CastMember } from '@/types/tmdb'

type CastListProps = {
  cast: CastMember[]
}

/**
 * A wall of portraits rather than a rail: a cast is scanned by face across, and
 * the credit's character is the second line of every cell. TMDB credits the top
 * of the bill first, so billing order is left exactly as it arrives.
 */
export function CastList({ cast }: CastListProps) {
  if (cast.length === 0) return null

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {cast.map((member) => (
        <li key={member.credit_id}>
          <PersonCard
            id={member.id}
            name={member.name}
            profilePath={member.profile_path}
            role={member.character === '' ? null : member.character}
          />
        </li>
      ))}
    </ul>
  )
}
