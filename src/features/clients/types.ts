export type ClientStatus = 'active' | 'inactive'

export type ClientListItem = {
  id: string
  name: string
  cpfMasked: string
  status: ClientStatus
  responsibleAdvisorName: string
}

export type ClientDetail = {
  id: string
  name: string
  email: string
  phone: string
  cpfMasked: string
  status: ClientStatus
  responsibleAdvisorId: string
  responsibleAdvisorName: string
  createdAt: string
}

export type StaffAdvisorOption = {
  id: string
  email: string
}

export type ClientsListFilters = {
  q?: string
  status?: ClientStatus
  responsibleAdvisorId?: string
}
