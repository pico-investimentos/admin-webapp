import { apiRequest } from '@/shared/http/api-client'

/** Mirrors the API `UserRole` enum; staff access is a predicate over this. */
export type UserRole = 'investor' | 'assessor' | 'admin'

/** Same projection as POST /auth/login and GET /me. */
export type SessionUser = {
  id: string
  email: string
  hasCpf: boolean
  isActive: boolean
  role: UserRole
}

export async function login(email: string, password: string) {
  return apiRequest<{ data: { user: SessionUser } }>('api/v1/auth/login', {
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
