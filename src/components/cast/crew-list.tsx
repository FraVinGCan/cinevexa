import { PersonLink } from '@/components/detail/person-link'
import type { CrewDepartment } from '@/features/catalog/detail'

type CrewListProps = {
  departments: CrewDepartment[]
}

/**
 * Crew is a lookup rather than a browse, so it reads as grouped names instead of
 * portraits: department, then the job each name did. One person can hold several
 * jobs and appears once per job rather than being collapsed, because the job is
 * the reason the name is here.
 */
export function CrewList({ departments }: CrewListProps) {
  if (departments.length === 0) return null

  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
      {departments.map((group) => (
        <section key={group.department} className="flex flex-col gap-3">
          <h3 className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            {group.department}
          </h3>
          <ul className="flex flex-col divide-y divide-border">
            {group.jobs.map((entry) => (
              <li
                key={`${entry.id}-${entry.job}`}
                className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 py-2">
                <PersonLink
                  id={entry.id}
                  name={entry.name}
                  className="text-sm font-medium text-card-foreground hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                />
                <span className="text-xs text-muted-foreground">
                  {entry.job}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
