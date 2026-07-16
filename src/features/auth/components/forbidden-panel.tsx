import { Button, Card } from '@heroui/react'
import { ShieldAlert } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { useLogout } from '@/features/auth/hooks/use-auth'
import { BrandMark } from '@/shared/components/brand-mark'

export function ForbiddenPanel() {
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    if (logoutMutation.isPending) {
      return
    }

    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        void navigate({ to: '/login' })
      },
    })
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f5f6fb] px-4 py-10">
      <Card className="surface-card w-full max-w-lg rounded-[24px] bg-white p-0">
        <Card.Content className="flex flex-col items-center p-8 text-center sm:p-10">
          <BrandMark />
          <span className="mt-8 flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <ShieldAlert aria-hidden="true" />
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
            Acesso restrito
          </p>
          <h1 className="mt-2 text-balance text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            Você não tem acesso ao Painel
          </h1>
          <p className="mt-3 text-pretty text-sm leading-6 text-slate-600">
            Esta área é exclusiva para a equipe Pico (assessores e
            administradores). Sua conta está autenticada, mas não tem a permissão
            necessária. Se acredita que isso é um engano, fale com um
            administrador.
          </p>
          <Button
            variant="primary"
            isDisabled={logoutMutation.isPending}
            onPress={handleLogout}
            className="mt-7 min-h-11 rounded-xl bg-[var(--brand-accent)] text-white"
          >
            {logoutMutation.isPending ? 'Saindo...' : 'Sair da conta'}
          </Button>
        </Card.Content>
      </Card>
    </div>
  )
}
