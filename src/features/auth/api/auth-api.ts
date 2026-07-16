import { apiRequest } from '@/shared/http/api-client'

export type StaffRole = 'investor' | 'assessor' | 'admin'

export type SessionUser = {
  id: string
  email: string
  hasCpf: boolean
  isActive?: boolean
  role: StaffRole
}

type LoginUser = Omit<SessionUser, 'role'> & { role?: StaffRole }

export async function login(email: string, password: string) {
  return apiRequest<{ data: { user: LoginUser } }>('api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export async function logout() {
  return apiRequest<void>('api/v1/auth/logout', {
    method: 'POST',
  })
}

export async function fetchCurrentUser() {
  return apiRequest<{ data: SessionUser }>('api/v1/me')
}
