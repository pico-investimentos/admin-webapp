import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import { AccountMenu } from '@/features/auth/components/account-menu'
import { AppShell } from '@/shared/components/app-shell'
import { AppErrorPage, NotFoundPage } from '@/shared/components/route-state'

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <AppShell headerAccessory={<AccountMenu />}>
      <Outlet />
    </AppShell>
  ),
  notFoundComponent: NotFoundPage,
  errorComponent: ({ error }) => <AppErrorPage message={error.message} />,
})
