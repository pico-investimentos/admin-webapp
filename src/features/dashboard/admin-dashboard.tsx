import { Card, Chip } from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Users } from 'lucide-react'
import { motion } from 'motion/react'

import { useCurrentUser } from '@/features/auth/hooks/use-auth'
import { ROLE_LABELS } from '@/features/auth/roles'

const plannedItems = [
  'Cadastro de cliente com e-mail de boas-vindas',
  'Edição de dados do cliente',
  'Gestão de assessores (somente administradores)',
]

export function AdminDashboard() {
  const { data: user } = useCurrentUser()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      className="mx-auto max-w-4xl"
    >
      <Chip variant="soft" color="accent" size="sm">
        Fundação do Painel
      </Chip>
      <div className="mt-5 flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-surface)] text-[var(--brand-accent-strong)]">
          <LayoutDashboard size={23} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-accent-strong)]">
            Bem-vindo(a)
          </p>
          <h1 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
            Painel administrativo Pico
          </h1>
          {user ? (
            <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-600 sm:text-base">
              Você está autenticado como{' '}
              <span className="font-semibold text-slate-800">{user.email}</span>{' '}
              ({ROLE_LABELS[user.role]}). A partir daqui a equipe vai gerenciar
              clientes e o relacionamento da Pico.
            </p>
          ) : null}
        </div>
      </div>

      <Card className="surface-card mt-9 rounded-[24px] bg-white p-0">
        <Card.Header className="p-6 pb-0 sm:p-7 sm:pb-0">
          <Card.Title className="flex items-center gap-2 text-lg font-semibold tracking-[-0.02em]">
            <Users size={18} strokeWidth={1.9} aria-hidden="true" />
            Clientes
          </Card.Title>
          <Card.Description className="mt-1 text-sm text-slate-500">
            Consulte a base com busca, filtros e detalhe mascarado de CPF.
          </Card.Description>
        </Card.Header>
        <Card.Content className="p-6 sm:p-7">
          <Link
            to="/clients"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--brand-accent)] px-4 text-sm font-medium text-white outline-none ring-[var(--brand-focus)] focus-visible:ring-2"
          >
            Abrir consulta de clientes
          </Link>
        </Card.Content>
      </Card>

      <Card className="surface-card mt-5 rounded-[24px] bg-white p-0">
        <Card.Header className="p-6 pb-0 sm:p-7 sm:pb-0">
          <Card.Title className="text-lg font-semibold tracking-[-0.02em]">
            Próximas entregas
          </Card.Title>
          <Card.Description className="mt-1 text-sm text-slate-500">
            Cadastro, e-mail de boas-vindas e edição vêm a seguir.
          </Card.Description>
        </Card.Header>
        <Card.Content className="p-6 sm:p-7">
          <ul className="grid gap-3 sm:grid-cols-2">
            {plannedItems.map((item) => (
              <li
                key={item}
                className="flex min-h-12 items-center gap-3 rounded-xl bg-[#f4f5fb] px-4 py-3 text-sm text-slate-700"
              >
                <span
                  className="size-1.5 shrink-0 rounded-full bg-[var(--brand-dot)]"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </Card.Content>
      </Card>
    </motion.div>
  )
}
