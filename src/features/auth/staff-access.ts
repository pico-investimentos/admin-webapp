import type { SessionUser, StaffRole } from '@/features/auth/api/auth-api'

const STAFF_ROLES: readonly StaffRole[] = ['assessor', 'admin']

export function isStaffRole(role: StaffRole): boolean {
  return STAFF_ROLES.includes(role)
}

/**
 * Pure decision for the route guard, kept UI/router-free so it is trivially
 * testable. Authorization itself lives in the API — this only decides where an
 * already-resolved session should land in the panel.
 */
export type StaffAccess = 'redirect-login' | 'redirect-forbidden' | 'allow'

export function evaluateStaffAccess(user: SessionUser | null): StaffAccess {
  if (!user) {
    return 'redirect-login'
  }
  // A deactivated account is authenticated but not permitted into the panel.
  if (user.isActive === false || !isStaffRole(user.role)) {
    return 'redirect-forbidden'
  }
  return 'allow'
}
