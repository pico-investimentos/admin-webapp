import type { ClientStatus } from '@/features/clients/types'

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
}

export function formatClientCreatedAt(iso: string): string {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return iso
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

/** Last-five-digit mask used by the API (`***.***.789-01`). */
export function isCpfMaskedFormat(value: string): boolean {
  return /^\*\*\*\.\*\*\*\.\d{3}-\d{2}$/.test(value)
}
