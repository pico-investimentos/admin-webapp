import { createFileRoute } from '@tanstack/react-router'

import { AdminDashboard } from '@/features/dashboard/admin-dashboard'
import { requireStaffSession } from '@/features/auth/require-session'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    await requireStaffSession(context.queryClient)
  },
  component: AdminDashboard,
})
