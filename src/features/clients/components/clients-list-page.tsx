import { useMemo, useState } from 'react'
import { Button, Chip } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { motion } from 'motion/react'

import {
  useClientsList,
  useStaffAdvisors,
} from '@/features/clients/hooks/use-clients'
import { useDebouncedValue } from '@/features/clients/hooks/use-debounced-value'
import { ClientStatusChip } from '@/features/clients/components/client-status-chip'
import {
  ClientsEmptyState,
  ClientsErrorState,
  ClientsForbiddenState,
  ClientsListSkeleton,
} from '@/features/clients/components/clients-query-states'
import type { ClientStatus } from '@/features/clients/types'
import { ApiError } from '@/shared/http/api-client'

const fieldClassName =
  'min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-[var(--brand-focus)] focus:ring-2'

export function ClientsListPage() {
  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState<ClientStatus | ''>('')
  const [responsibleAdvisorId, setResponsibleAdvisorId] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  const filters = useMemo(
    () => ({
      ...(debouncedSearch.trim() ? { q: debouncedSearch.trim() } : {}),
      ...(status ? { status } : {}),
      ...(responsibleAdvisorId
        ? { responsibleAdvisorId }
        : {}),
    }),
    [debouncedSearch, responsibleAdvisorId, status],
  )

  const hasFilters = Boolean(
    searchInput.trim() || status || responsibleAdvisorId,
  )

  const listQuery = useClientsList(filters)
  const advisorsQuery = useStaffAdvisors()

  const clients =
    listQuery.data?.pages.flatMap((page) => page.data) ?? []

  const handleClearFilters = () => {
    setSearchInput('')
    setStatus('')
    setResponsibleAdvisorId('')
  }

  const isForbidden =
    (listQuery.error instanceof ApiError && listQuery.error.status === 403) ||
    (advisorsQuery.error instanceof ApiError &&
      advisorsQuery.error.status === 403)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      className="mx-auto max-w-5xl"
    >
      <Chip variant="soft" color="accent" size="sm">
        Clientes
      </Chip>
      <div className="mt-5 flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-surface)] text-[var(--brand-accent-strong)]">
          <Users size={23} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Consultar clientes
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-600 sm:text-base">
            Busque por nome ou e-mail, filtre por status e responsável, e abra o
            detalhe de um cliente.
          </p>
        </div>
      </div>

      <form
        className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="block space-y-2 sm:col-span-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-700">Busca</span>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Nome ou e-mail"
            className={fieldClassName}
            autoComplete="off"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ClientStatus | '')
            }
            className={fieldClassName}
          >
            <option value="">Todos</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Responsável</span>
          <select
            value={responsibleAdvisorId}
            onChange={(event) => setResponsibleAdvisorId(event.target.value)}
            className={fieldClassName}
          >
            <option value="">Todos</option>
            {(advisorsQuery.data?.data ?? []).map((advisor) => (
              <option key={advisor.id} value={advisor.id}>
                {advisor.email}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="mt-8">
        {isForbidden ? <ClientsForbiddenState /> : null}

        {!isForbidden && listQuery.isLoading ? <ClientsListSkeleton /> : null}

        {!isForbidden && listQuery.isError && !isForbidden ? (
          <ClientsErrorState
            message={
              listQuery.error instanceof ApiError
                ? listQuery.error.message
                : 'Não foi possível carregar os clientes.'
            }
            onRetry={() => {
              void listQuery.refetch()
            }}
          />
        ) : null}

        {!isForbidden && listQuery.isSuccess && clients.length === 0 ? (
          <ClientsEmptyState
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
          />
        ) : null}

        {!isForbidden && listQuery.isSuccess && clients.length > 0 ? (
          <div className="space-y-3">
            <ul className="space-y-3" aria-label="Lista de clientes">
              {clients.map((client) => (
                <li key={client.id}>
                  <Link
                    to="/clients/$id"
                    params={{ id: client.id }}
                    className="surface-card flex flex-col gap-3 rounded-2xl bg-white px-4 py-4 transition hover:shadow-[var(--shadow-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)] sm:flex-row sm:items-center sm:justify-between sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold tracking-[-0.02em] text-slate-950">
                        {client.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        CPF {client.cpfMasked}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <ClientStatusChip status={client.status} />
                      <p className="text-sm text-slate-600">
                        {client.responsibleAdvisorName}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {listQuery.hasNextPage ? (
              <div className="pt-2">
                <Button
                  variant="secondary"
                  isDisabled={listQuery.isFetchingNextPage}
                  onPress={() => {
                    void listQuery.fetchNextPage()
                  }}
                  className="min-h-11 rounded-xl"
                >
                  {listQuery.isFetchingNextPage
                    ? 'Carregando...'
                    : 'Carregar mais'}
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
