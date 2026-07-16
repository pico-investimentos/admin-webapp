import { useState, type FormEvent } from 'react'
import { Button } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'

import { useLogin } from '@/features/auth/hooks/use-auth'
import { BrandMark } from '@/shared/components/brand-mark'
import { ApiError } from '@/shared/http/api-client'

export function LoginForm() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (loginMutation.isPending) {
      return
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          void navigate({ to: '/' })
        },
      },
    )
  }

  const errorMessage =
    loginMutation.error instanceof ApiError
      ? loginMutation.error.message
      : loginMutation.isError
        ? 'Não foi possível entrar. Tente novamente.'
        : null

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f5f6fb] px-4">
      <div className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <BrandMark />
        <h1 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
          Entrar no Painel
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Acesso restrito à equipe Pico (assessores e administradores).
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">E-mail</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-[var(--brand-focus)] focus:ring-2"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Senha</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-[var(--brand-focus)] focus:ring-2"
            />
          </label>

          {errorMessage ? (
            <p role="alert" className="text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            isDisabled={loginMutation.isPending}
            className="min-h-11 w-full rounded-xl bg-[var(--brand-accent)] text-white"
          >
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
