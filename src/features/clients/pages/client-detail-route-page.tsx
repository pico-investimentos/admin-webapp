import { useParams } from '@tanstack/react-router'

import { ClientDetailPage } from '@/features/clients/components/client-detail-page'

export function ClientDetailRoutePage() {
  const { id } = useParams({ from: '/clients/$id' })
  return <ClientDetailPage clientId={id} />
}
