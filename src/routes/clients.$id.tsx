import { createFileRoute } from '@tanstack/react-router'

import { requireStaffSession } from '@/features/auth/require-session'
import { ClientDetailRoutePage } from '@/features/clients/pages/client-detail-route-page'

export const Route = createFileRoute('/clients/$id')({
  beforeLoad: async ({ context }) => {
    await requireStaffSession(context.queryClient)
  },
  component: ClientDetailRoutePage,
})
