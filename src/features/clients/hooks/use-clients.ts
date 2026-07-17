import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from '@tanstack/react-query'

import {
  fetchClient,
  fetchClients,
  fetchStaffAdvisors,
  type ClientsListResponse,
} from '@/features/clients/api/clients-api'
import type { ClientsListFilters } from '@/features/clients/types'

export const clientsListQueryKey = (filters: ClientsListFilters) =>
  ['clients', 'list', filters] as const

export const clientDetailQueryKey = (id: string) =>
  ['clients', 'detail', id] as const

export const staffAdvisorsQueryKey = ['clients', 'advisors'] as const

export function useClientsList(filters: ClientsListFilters) {
  return useInfiniteQuery<
    ClientsListResponse,
    Error,
    InfiniteData<ClientsListResponse>,
    ReturnType<typeof clientsListQueryKey>,
    string | undefined
  >({
    queryKey: clientsListQueryKey(filters),
    queryFn: ({ pageParam }) =>
      fetchClients({
        ...filters,
        ...(pageParam ? { cursor: pageParam } : {}),
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}

export function useClientDetail(id: string) {
  return useQuery({
    queryKey: clientDetailQueryKey(id),
    queryFn: () => fetchClient(id),
    enabled: Boolean(id),
  })
}

export function useStaffAdvisors() {
  return useQuery({
    queryKey: staffAdvisorsQueryKey,
    queryFn: fetchStaffAdvisors,
    staleTime: 60_000,
  })
}
