import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { login, logout } from '@/features/auth/api/auth-api'
import { currentUserQueryKey, fetchSessionUser } from '@/features/auth/session'

export { currentUserQueryKey }

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: fetchSessionUser,
    retry: false,
    staleTime: 60_000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (result) => {
      queryClient.setQueryData(currentUserQueryKey, result.data.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.setQueryData(currentUserQueryKey, null)
    },
  })
}
