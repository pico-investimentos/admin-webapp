import { redirect } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { currentUserQueryKey, fetchSessionUser } from '@/features/auth/session'
import { evaluateStaffAccess } from '@/features/auth/staff-access'

async function resolveSessionUser(queryClient: QueryClient) {
  return queryClient.ensureQueryData({
    queryKey: currentUserQueryKey,
    queryFn: fetchSessionUser,
  })
}

/** Guard for staff-only routes: requires a session AND an active `assessor|admin` role. */
export async function requireStaffSession(queryClient: QueryClient) {
  const user = await resolveSessionUser(queryClient)

  switch (evaluateStaffAccess(user)) {
    case 'redirect-login':
      throw redirect({ to: '/login' })
    case 'redirect-forbidden':
      throw redirect({ to: '/forbidden' })
    case 'allow':
      return user!
  }
}

export { resolveSessionUser }
