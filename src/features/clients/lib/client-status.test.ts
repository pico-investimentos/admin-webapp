import { describe, expect, it } from 'vitest'

import {
  CLIENT_STATUS_LABELS,
  formatClientCreatedAt,
  isCpfMaskedFormat,
} from '@/features/clients/lib/client-status'

describe('client status helpers', () => {
  it('exposes labels for active and inactive', () => {
    expect(CLIENT_STATUS_LABELS.active).toBe('Ativo')
    expect(CLIENT_STATUS_LABELS.inactive).toBe('Inativo')
  })

  it('validates the API cpfMasked format', () => {
    expect(isCpfMaskedFormat('***.***.447-05')).toBe(true)
    expect(isCpfMaskedFormat('390.533.447-05')).toBe(false)
    expect(isCpfMaskedFormat('39053344705')).toBe(false)
  })

  it('formats createdAt for pt-BR display', () => {
    expect(formatClientCreatedAt('2026-07-01T10:00:00.000Z')).toMatch(/2026/)
  })
})
