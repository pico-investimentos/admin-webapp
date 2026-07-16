import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ForbiddenPanel } from '@/features/auth/components/forbidden-panel'
import * as authApi from '@/features/auth/api/auth-api'

const { navigateSpy } = vi.hoisted(() => ({ navigateSpy: vi.fn() }))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return { ...actual, useNavigate: () => navigateSpy }
})

function renderWithQuery(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  navigateSpy.mockReset()
})

describe('ForbiddenPanel', () => {
  it('explains the restriction to a non-staff user', () => {
    renderWithQuery(<ForbiddenPanel />)

    expect(
      screen.getByRole('heading', { name: 'Você não tem acesso ao Painel' }),
    ).toBeInTheDocument()
  })

  it('logs out and returns to login', async () => {
    vi.spyOn(authApi, 'logout').mockResolvedValue(undefined)

    const user = userEvent.setup()
    renderWithQuery(<ForbiddenPanel />)

    await user.click(screen.getByRole('button', { name: 'Sair da conta' }))

    await waitFor(() => {
      expect(authApi.logout).toHaveBeenCalledTimes(1)
      expect(navigateSpy).toHaveBeenCalledWith({ to: '/login' })
    })
  })
})
