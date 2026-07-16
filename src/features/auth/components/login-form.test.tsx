import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LoginForm } from '@/features/auth/components/login-form'
import * as authApi from '@/features/auth/api/auth-api'
import type { SessionUser } from '@/features/auth/api/auth-api'
import { ApiError } from '@/shared/http/api-client'

const { navigateSpy } = vi.hoisted(() => ({ navigateSpy: vi.fn() }))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return { ...actual, useNavigate: () => navigateSpy }
})

const adminUser: SessionUser = {
  id: '1',
  email: 'admin@pico.test',
  hasCpf: false,
  role: 'admin',
}

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

describe('LoginForm', () => {
  it('logs in and navigates to the panel on success', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValue({
      data: { user: { id: '1', email: 'admin@pico.test', hasCpf: false } },
    })
    vi.spyOn(authApi, 'fetchCurrentUser').mockResolvedValue({ data: adminUser })

    const user = userEvent.setup()
    renderWithQuery(<LoginForm />)

    await user.type(screen.getByLabelText('E-mail'), 'admin@pico.test')
    await user.type(screen.getByLabelText('Senha'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith('admin@pico.test', 'password123')
      expect(navigateSpy).toHaveBeenCalledWith({ to: '/' })
    })
  })

  it('shows the API error message on failure', async () => {
    vi.spyOn(authApi, 'login').mockRejectedValue(
      new ApiError('E-mail ou senha inválidos.', 401, 'INVALID_CREDENTIALS'),
    )

    const user = userEvent.setup()
    renderWithQuery(<LoginForm />)

    await user.type(screen.getByLabelText('E-mail'), 'admin@pico.test')
    await user.type(screen.getByLabelText('Senha'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'E-mail ou senha inválidos.',
    )
    expect(navigateSpy).not.toHaveBeenCalled()
  })

  it('disables the button while the request is pending', async () => {
    vi.spyOn(authApi, 'login').mockImplementation(
      () => new Promise(() => {}),
    )

    const user = userEvent.setup()
    renderWithQuery(<LoginForm />)

    await user.type(screen.getByLabelText('E-mail'), 'admin@pico.test')
    await user.type(screen.getByLabelText('Senha'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      await screen.findByRole('button', { name: 'Entrando...' }),
    ).toBeDisabled()
  })
})
