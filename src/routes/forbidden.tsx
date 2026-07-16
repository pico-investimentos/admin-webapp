import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenPanel } from '@/features/auth/components/forbidden-panel'

export const Route = createFileRoute('/forbidden')({
  component: ForbiddenPanel,
})
