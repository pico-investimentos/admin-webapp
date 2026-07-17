import { Chip } from '@heroui/react'

import {
  CLIENT_STATUS_LABELS,
} from '@/features/clients/lib/client-status'
import type { ClientStatus } from '@/features/clients/types'

export function ClientStatusChip({ status }: { status: ClientStatus }) {
  const label = CLIENT_STATUS_LABELS[status]
  const isActive = status === 'active'

  return (
    <Chip
      size="sm"
      variant="soft"
      aria-label={`Status: ${label}`}
      className={
        isActive
          ? 'bg-emerald-50 text-emerald-800'
          : 'bg-slate-100 text-slate-700'
      }
    >
      {label}
    </Chip>
  )
}
