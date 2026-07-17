import { Chip } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, UserRound } from 'lucide-react'
import { motion } from 'motion/react'

import { ClientStatusChip } from '@/features/clients/components/client-status-chip'
import {
  ClientDetailSkeleton,
  ClientsErrorState,
  ClientsForbiddenState,
} from '@/features/clients/components/clients-query-states'
import { useClientDetail } from '@/features/clients/hooks/use-clients'
import { formatClientCreatedAt } from '@/features/clients/lib/client-status'
import { ApiError } from '@/shared/http/api-client'

function DetailField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </dt>
      <dd className="text-sm font-medium text-slate-900 sm:text-base">{value}</dd>
    </div>
  )
}

export function ClientDetailPage({ clientId }: { clientId: string }) {
  const detailQuery = useClientDetail(clientId)
  const client = detailQuery.data?.data

  const isForbidden =
    detailQuery.error instanceof ApiError && detailQuery.error.status === 403
  const isNotFound =
    detailQuery.error instanceof ApiError && detailQuery.error.status === 404

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      className="mx-auto max-w-3xl"
    >
      <Link
        to="/clients"
        className="inline-flex min-h-10 items-center gap-2 rounded-xl text-sm font-medium text-[var(--brand-accent-strong)] outline-none ring-[var(--brand-focus)] focus-visible:ring-2"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para a lista
      </Link>

      <div className="mt-6">
        <Chip variant="soft" color="accent" size="sm">
          Detalhe
        </Chip>
      </div>

      {detailQuery.isLoading ? (
        <div className="mt-6">
          <ClientDetailSkeleton />
        </div>
      ) : null}

      {isForbidden ? (
        <div className="mt-6">
          <ClientsForbiddenState />
        </div>
      ) : null}

      {detailQuery.isError && !isForbidden ? (
        <div className="mt-6">
          <ClientsErrorState
            message={
              isNotFound
                ? 'Cliente não encontrado.'
                : detailQuery.error instanceof ApiError
                  ? detailQuery.error.message
                  : 'Não foi possível carregar o cliente.'
            }
            onRetry={() => {
              void detailQuery.refetch()
            }}
          />
        </div>
      ) : null}

      {client ? (
        <div className="mt-5">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-surface)] text-[var(--brand-accent-strong)]">
              <UserRound size={23} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                  {client.name}
                </h1>
                <ClientStatusChip status={client.status} />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                CPF {client.cpfMasked}
              </p>
            </div>
          </div>

          <dl className="surface-card mt-8 grid gap-6 rounded-[24px] bg-white p-6 sm:grid-cols-2 sm:p-8">
            <DetailField label="E-mail" value={client.email} />
            <DetailField label="Telefone" value={client.phone} />
            <DetailField label="CPF" value={client.cpfMasked} />
            <DetailField
              label="Responsável"
              value={client.responsibleAdvisorName}
            />
            <DetailField
              label="Cadastro"
              value={formatClientCreatedAt(client.createdAt)}
            />
            <div className="space-y-1">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Status
              </dt>
              <dd>
                <ClientStatusChip status={client.status} />
              </dd>
            </div>
          </dl>

        </div>
      ) : null}
    </motion.div>
  )
}
