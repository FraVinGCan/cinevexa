import { useParams } from 'react-router'
import { DiscoverPage } from '@/features/discover/components/discover-page'
import {
  discoverMediaTypeOf,
  isDiscoverSegment,
} from '@/features/discover/discover.schema'

export function Component() {
  const params = useParams()
  const segment = isDiscoverSegment(params.mediaType)
    ? params.mediaType
    : 'movies'
  return <DiscoverPage mediaType={discoverMediaTypeOf(segment)} />
}
