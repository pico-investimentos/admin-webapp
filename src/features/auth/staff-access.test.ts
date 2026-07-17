import { describe, expect, it } from 'vitest'

import type { SessionUser } from '@/features/auth/api/auth-api'
import { evaluateStaffAccess, isStaffRole } from '@/features/auth/staff-access'

function userWithRole(role: SessionUser['role']): SessionUser {
  return {
    id: '1',
    email: 'person@pico.test',
    hasCpf: false,
    isActive: true,
    role,
  }
}

describe('isStaffRole', () => {
  it('accepts assessor and admin', () => {
    expect(isStaffRole('assessor')).toBe(true)
    expect(isStaffRole('admin')).toBe(true)
  })

  it('rejects investor', () => {
    expect(isStaffRole('investor')).toBe(false)
  })
})

describe('evaluateStaffAccess', () => {
  it('redirects to login when there is no session', () => {
    expect(evaluateStaffAccess(null)).toBe('redirect-login')
  })

  it('redirects an authenticated investor to the forbidden screen', () => {
    expect(evaluateStaffAccess(userWithRole('investor'))).toBe(
      'redirect-forbidden',
    )
  })

  it('allows staff roles', () => {
    expect(evaluateStaffAccess(userWithRole('assessor'))).toBe('allow')
    expect(evaluateStaffAccess(userWithRole('admin'))).toBe('allow')
  })

  it('blocks a deactivated staff account', () => {
    expect(evaluateStaffAccess({ ...userWithRole('admin'), isActive: false })).toBe(
      'redirect-forbidden',
    )
  })

  it('allows active staff', () => {
    expect(evaluateStaffAccess({ ...userWithRole('assessor'), isActive: true })).toBe(
      'allow',
    )
  })
})
