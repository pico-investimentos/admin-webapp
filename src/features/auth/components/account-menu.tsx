import { Button } from '@heroui/react'
import { LogOut } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { useCurrentUser, useLogout } from '@/features/auth/hooks/use-auth'
import { ROLE_LABELS, initialsFromEmail } from '@/features/auth/roles'

export function AccountMenu() {
  const { data: user } = useCurrentUser()
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  if (!user) {
    return null
  }

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
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="user-summary" aria-label="Conta autenticada">
        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--brand-surface)] text-sm font-semibold text-[var(--brand-accent-strong)]">
          {initialsFromEmail(user.email)}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block max-w-[200px] truncate text-sm font-semibold leading-tight text-slate-900">
            {user.email}
          </span>
          <span className="mt-0.5 block text-xs leading-tight text-slate-500">
            {ROLE_LABELS[user.role]}
          </span>
        </span>
      </div>
      <div className="hidden h-9 w-px bg-slate-900/8 sm:block" aria-hidden="true" />
      <Button
        variant="ghost"
        isDisabled={logoutMutation.isPending}
        onPress={handleLogout}
        className="min-h-10 gap-2 rounded-xl text-slate-600"
      >
        <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
        <span className="hidden sm:inline">
          {logoutMutation.isPending ? 'Saindo...' : 'Sair'}
        </span>
      </Button>
    </div>
  )
}
