import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ClientsListPage } from '@/features/clients/components/clients-list-page'
import * as clientsApi from '@/features/clients/api/clients-api'
import { ApiError } from '@/shared/http/api-client'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: ({
      children,
      to,
      params,
      ...rest
    }: {
      children: ReactNode
      to: string
      params?: { id?: string }
      className?: string
    }) => (
      <a
        href={params?.id ? `${to.replace('$id', params.id)}` : to}
        {...rest}
      >
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

describe('ClientsListPage', () => {
  it('shows loading, then the client list with masked CPF', async () => {
    vi.spyOn(clientsApi, 'fetchStaffAdvisors').mockResolvedValue({
      data: [{ id: 'adv-1', email: 'assessor@pico.test' }],
    })
    vi.spyOn(clientsApi, 'fetchClients').mockResolvedValue({
      data: [
        {
          id: 'client-1',
          name: 'Maria Silva',
          cpfMasked: '***.***.447-05',
          status: 'active',
          responsibleAdvisorName: 'assessor@pico.test',
        },
      ],
      nextCursor: null,
    })

    renderWithQuery(<ClientsListPage />)

    expect(screen.getByLabelText('Carregando clientes')).toBeInTheDocument()

    expect(await screen.findByText('Maria Silva')).toBeInTheDocument()
    expect(screen.getByText('CPF ***.***.447-05')).toBeInTheDocument()
    expect(screen.getByLabelText('Status: Ativo')).toBeInTheDocument()
  })

  it('shows empty state with clear filters when search has no results', async () => {
    vi.spyOn(clientsApi, 'fetchStaffAdvisors').mockResolvedValue({ data: [] })
    vi.spyOn(clientsApi, 'fetchClients').mockResolvedValue({
      data: [],
      nextCursor: null,
    })

    const user = userEvent.setup()
    renderWithQuery(<ClientsListPage />)

    await user.type(screen.getByLabelText('Busca'), 'ninguém')

    expect(
      await screen.findByText('Nenhum cliente encontrado'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    await waitFor(() => {
      expect(screen.getByLabelText('Busca')).toHaveValue('')
    })
  })

  it('shows error with retry', async () => {
    vi.spyOn(clientsApi, 'fetchStaffAdvisors').mockResolvedValue({ data: [] })
    const fetchClients = vi
      .spyOn(clientsApi, 'fetchClients')
      .mockRejectedValueOnce(new ApiError('Falha temporária.', 500, 'INTERNAL'))
      .mockResolvedValueOnce({ data: [], nextCursor: null })

    const user = userEvent.setup()
    renderWithQuery(<ClientsListPage />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Falha temporária.')
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    await waitFor(() => {
      expect(fetchClients).toHaveBeenCalledTimes(2)
    })
  })

  it('shows a dedicated 403 state', async () => {
    vi.spyOn(clientsApi, 'fetchStaffAdvisors').mockRejectedValue(
      new ApiError('Acesso restrito à equipe.', 403, 'FORBIDDEN'),
    )
    vi.spyOn(clientsApi, 'fetchClients').mockRejectedValue(
      new ApiError('Acesso restrito à equipe.', 403, 'FORBIDDEN'),
    )

    renderWithQuery(<ClientsListPage />)

    expect(
      await screen.findByText('Você não pode consultar clientes'),
    ).toBeInTheDocument()
  })
})
