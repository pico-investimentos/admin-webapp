import { Button, Card } from '@heroui/react'
import { ShieldAlert } from 'lucide-react'

export function ClientsListSkeleton() {
  return (
    <div
      className="space-y-3"
      role="status"
      aria-live="polite"
      aria-label="Carregando clientes"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-2xl bg-slate-200/70"
        />
      ))}
    </div>
  )
}

export function ClientDetailSkeleton() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-live="polite"
      aria-label="Carregando cliente"
    >
      <div className="h-10 w-2/3 animate-pulse rounded-xl bg-slate-200/70" />
      <div className="h-40 animate-pulse rounded-2xl bg-slate-200/70" />
    </div>
  )
}

export function ClientsEmptyState({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean
  onClearFilters: () => void
}) {
  return (
    <Card className="surface-card rounded-[24px] bg-white p-0">
      <Card.Content className="flex flex-col items-start gap-4 p-6 sm:p-8">
        <p className="text-base font-semibold text-slate-900">
          Nenhum cliente encontrado
        </p>
        <p className="text-sm leading-6 text-slate-600">
          {hasFilters
            ? 'Nenhum resultado para a busca ou filtros atuais. Ajuste os critérios ou limpe os filtros.'
            : 'Ainda não há clientes cadastrados no Painel.'}
        </p>
        {hasFilters ? (
          <Button
            variant="secondary"
            onPress={onClearFilters}
            className="min-h-11 rounded-xl"
          >
            Limpar filtros
          </Button>
        ) : null}
      </Card.Content>
    </Card>
  )
}

export function ClientsErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <Card className="surface-card rounded-[24px] bg-white p-0">
      <Card.Content className="flex flex-col items-start gap-4 p-6 sm:p-8">
        <p role="alert" className="text-sm font-medium text-red-700">
          {message}
        </p>
        <Button
          variant="primary"
          onPress={onRetry}
          className="min-h-11 rounded-xl bg-[var(--brand-accent)] text-white"
        >
          Tentar novamente
        </Button>
      </Card.Content>
    </Card>
  )
}

export function ClientsForbiddenState() {
  return (
    <Card className="surface-card rounded-[24px] bg-white p-0">
      <Card.Content className="flex flex-col items-center p-8 text-center sm:p-10">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <ShieldAlert aria-hidden="true" />
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
          Sem permissão
        </p>
        <h2 className="mt-2 text-balance text-xl font-semibold tracking-[-0.03em] text-slate-950">
          Você não pode consultar clientes
        </h2>
        <p className="mt-3 max-w-md text-pretty text-sm leading-6 text-slate-600">
          Esta consulta é exclusiva da equipe Pico. Se acredita que isso é um
          engano, fale com um administrador.
        </p>
      </Card.Content>
    </Card>
  )
}
