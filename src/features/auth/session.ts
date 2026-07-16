import { fetchCurrentUser } from '@/features/auth/api/auth-api'
import type { SessionUser } from '@/features/auth/api/auth-api'
import { ApiError } from '@/shared/http/api-client'

export const currentUserQueryKey = ['auth', 'me'] as const

/** Resolves the current session, mapping an unauthenticated 401 to `null`. */
export async function fetchSessionUser(): Promise<SessionUser | null> {
  try {
    const response = await fetchCurrentUser()
    return response.data
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }
    throw error
  }
}
