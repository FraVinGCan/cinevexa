import { Link } from 'react-router'

type PersonLinkProps = {
  id: number
  name: string
  className?: string
}

export function PersonLink({ id, name, className }: PersonLinkProps) {
  return (
    <Link to={`/person/${id}`} className={className}>
      {name}
    </Link>
  )
}
