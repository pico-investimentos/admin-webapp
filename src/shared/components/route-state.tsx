import { Button, Card } from '@heroui/react'
import { AlertTriangle, Compass, Loader2 } from 'lucide-react'

import { BrandMark } from '@/shared/components/brand-mark'

export function RoutePending() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[40dvh] flex-col items-center justify-center gap-3 text-slate-500"
    >
      <Loader2
        className="size-6 animate-spin text-[var(--brand-accent)]"
        aria-hidden="true"
      />
      <span className="text-sm">Carregando...</span>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--brand-surface)] text-[var(--brand-accent-strong)]">
        <Compass aria-hidden="true" />
      </span>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent-strong)]">
        Erro 404
      </p>
      <h1 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.035em] text-slate-950">
        Esta página não foi encontrada
      </h1>
      <p className="mt-3 max-w-md text-pretty text-sm leading-6 text-slate-600">
        O endereço pode ter mudado ou ainda não faz parte do Painel.
      </p>
      <Button
        variant="primary"
        className="mt-7 min-h-10 rounded-xl bg-[var(--brand-accent)] text-white"
        onPress={() => window.location.assign('/')}
      >
        Voltar ao início
      </Button>
    </div>
  )
}

export function AppErrorPage({ message }: { message?: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f5f6fb] px-4 py-10">
      <Card className="surface-card w-full max-w-lg rounded-[24px] bg-white p-0">
        <Card.Content className="flex flex-col items-center p-8 text-center sm:p-10">
          <BrandMark />
          <span className="mt-8 flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <AlertTriangle aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-balance text-2xl font-semibold tracking-[-0.03em]">
            Não foi possível abrir esta área
          </h1>
          <p className="mt-3 text-pretty text-sm leading-6 text-slate-600">
            {message ||
              'Tente novamente. Se o problema continuar, entre em contato com um administrador.'}
          </p>
          <Button
            variant="primary"
            className="mt-7 min-h-10 rounded-xl bg-[var(--brand-accent)] text-white"
            onPress={() => window.location.reload()}
          >
            Tentar novamente
          </Button>
        </Card.Content>
      </Card>
    </div>
  )
}
