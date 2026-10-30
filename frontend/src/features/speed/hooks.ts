import { useQuery } from '@tanstack/react-query'

import { fetchSpeedTiers } from './api'

export function useSpeedTiers() {
  return useQuery({
    queryKey: ['pokemon', 'speed-tiers'],
    queryFn: ({ signal }) => fetchSpeedTiers(signal),
    staleTime: Infinity,
  })
}
