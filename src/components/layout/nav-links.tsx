import { cn } from 'cn'
import { NavLink } from 'react-router'
import type { NavItem } from '@/app/navigation'

type NavLinksProps = {
  items: NavItem[]
  onNavigate?: () => void
  className?: string
  linkClassName?: string
}

export function NavLinks({
  items,
  onNavigate,
  className,
  linkClassName,
}: NavLinksProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'relative inline-flex items-center rounded-full px-3 text-sm font-medium whitespace-nowrap transition-colors',
              'focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
              linkClassName,
            )
          }>
          {({ isActive }) => (
            <>
              {item.label}
              <span
                aria-hidden
                className={cn(
                  'absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary transition-opacity',
                  isActive ? 'opacity-100' : 'opacity-0',
                )}
              />
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
