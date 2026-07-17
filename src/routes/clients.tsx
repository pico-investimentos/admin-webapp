import { createFileRoute } from '@tanstack/react-router'

import { requireStaffSession } from '@/features/auth/require-session'
import { ClientsListPage } from '@/features/clients/components/clients-list-page'

export const Route = createFileRoute('/clients')({
  beforeLoad: async ({ context }) => {
    await requireStaffSession(context.queryClient)
  },
  component: ClientsListPage,
})
