import { useQuery } from '@tanstack/react-query'

import { healthApi } from '../../api/client.ts'

export const healthQueryKey = ['service-health'] as const

export function useHealthQuery() {
  return useQuery({
    queryKey: healthQueryKey,
    queryFn: ({ signal }) => healthApi.check(signal),
    refetchInterval: 60_000,
  })
}
