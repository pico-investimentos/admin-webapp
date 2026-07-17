import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ClientDetailPage } from '@/features/clients/components/client-detail-page'
import * as clientsApi from '@/features/clients/api/clients-api'
import { ApiError } from '@/shared/http/api-client'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: ({
      children,
      to,
      ...rest
    }: {
      children: ReactNode
      to: string
      className?: string
    }) => (
      <a href={to} {...rest}>
        {children}
      </a>
    ),
  }
})

function renderWithQuery(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('ClientDetailPage', () => {
  it('renders detail with masked CPF after loading', async () => {
    vi.spyOn(clientsApi, 'fetchClient').mockResolvedValue({
      data: {
        id: 'client-1',
        name: 'Maria Silva',
        email: 'maria@example.com',
        phone: '11999990000',
        cpfMasked: '***.***.447-05',
        status: 'active',
        responsibleAdvisorId: 'adv-1',
        responsibleAdvisorName: 'assessor@pico.test',
        createdAt: '2026-07-01T10:00:00.000Z',
      },
    })

    renderWithQuery(<ClientDetailPage clientId="client-1" />)

    expect(screen.getByLabelText('Carregando cliente')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Maria Silva' })).toBeInTheDocument()
    expect(screen.getAllByText('***.***.447-05').length).toBeGreaterThan(0)
    expect(screen.getByText('maria@example.com')).toBeInTheDocument()
  })

  it('shows dedicated 403 state', async () => {
    vi.spyOn(clientsApi, 'fetchClient').mockRejectedValue(
      new ApiError('Acesso restrito à equipe.', 403, 'FORBIDDEN'),
    )

    renderWithQuery(<ClientDetailPage clientId="client-1" />)

    expect(
      await screen.findByText('Você não pode consultar clientes'),
    ).toBeInTheDocument()
  })

  it('shows error with retry', async () => {
    const fetchClient = vi
      .spyOn(clientsApi, 'fetchClient')
      .mockRejectedValueOnce(new ApiError('Falha temporária.', 500, 'INTERNAL'))
      .mockResolvedValueOnce({
        data: {
          id: 'client-1',
          name: 'Maria Silva',
          email: 'maria@example.com',
          phone: '11999990000',
          cpfMasked: '***.***.447-05',
          status: 'active',
          responsibleAdvisorId: 'adv-1',
          responsibleAdvisorName: 'assessor@pico.test',
          createdAt: '2026-07-01T10:00:00.000Z',
        },
      })

    const user = userEvent.setup()
    renderWithQuery(<ClientDetailPage clientId="client-1" />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Falha temporária.')
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(await screen.findByRole('heading', { name: 'Maria Silva' })).toBeInTheDocument()
    expect(fetchClient).toHaveBeenCalledTimes(2)
  })
})
