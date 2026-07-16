import { createFileRoute, redirect } from '@tanstack/react-router'

import { LoginForm } from '@/features/auth/components/login-form'
import { currentUserQueryKey, fetchSessionUser } from '@/features/auth/session'
import { evaluateStaffAccess } from '@/features/auth/staff-access'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      queryKey: currentUserQueryKey,
      queryFn: fetchSessionUser,
    })

    const access = evaluateStaffAccess(user)
    if (access === 'allow') {
      throw redirect({ to: '/' })
    }
    if (access === 'redirect-forbidden') {
      throw redirect({ to: '/forbidden' })
    }
  },
  component: LoginForm,
})
