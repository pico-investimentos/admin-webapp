import { apiRequest } from '@/shared/http/api-client'

import type {
  ClientDetail,
  ClientListItem,
  ClientsListFilters,
  StaffAdvisorOption,
} from '@/features/clients/types'

export type ClientsListResponse = {
  data: ClientListItem[]
  nextCursor: string | null
}

export type ClientDetailResponse = {
  data: ClientDetail
}

export type StaffAdvisorsResponse = {
  data: StaffAdvisorOption[]
}

function buildClientsQuery(
  filters: ClientsListFilters & { cursor?: string; limit?: number },
): string {
  const params = new URLSearchParams()

  if (filters.q?.trim()) {
    params.set('q', filters.q.trim())
  }
  if (filters.status) {
    params.set('status', filters.status)
  }
  if (filters.responsibleAdvisorId) {
    params.set('responsibleAdvisorId', filters.responsibleAdvisorId)
  }
  if (filters.cursor) {
    params.set('cursor', filters.cursor)
  }
  if (filters.limit !== undefined) {
    params.set('limit', String(filters.limit))
  }

  const query = params.toString()
  return query ? `api/v1/clients?${query}` : 'api/v1/clients'
}

export async function fetchClients(
  filters: ClientsListFilters & { cursor?: string; limit?: number } = {},
) {
  return apiRequest<ClientsListResponse>(buildClientsQuery(filters))
}

export async function fetchClient(id: string) {
  return apiRequest<ClientDetailResponse>(`api/v1/clients/${id}`)
}

export async function fetchStaffAdvisors() {
  return apiRequest<StaffAdvisorsResponse>('api/v1/clients/advisors')
}
