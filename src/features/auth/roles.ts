import type { StaffRole } from '@/features/auth/api/auth-api'

export const ROLE_LABELS: Record<StaffRole, string> = {
  admin: 'Administrador',
  assessor: 'Assessor',
  investor: 'Investidor',
}

export function initialsFromEmail(email: string): string {
  const [localPart] = email.split('@')
  const letters = (localPart ?? '').replace(/[^a-zA-Z]/g, '')
  return (letters.slice(0, 2) || 'PP').toUpperCase()
}
