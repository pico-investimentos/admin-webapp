import type { PropsWithChildren, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { House, Users } from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'

import { BrandMark } from '@/shared/components/brand-mark'

type AppPath = '/' | '/clients'

type NavigationItem = {
  label: string
  shortLabel: string
  to: AppPath
  icon: LucideIcon
}

type AppShellProps = PropsWithChildren<{
  headerAccessory?: ReactNode
}>

const navigationItems: NavigationItem[] = [
  { label: 'Visão geral', shortLabel: 'Início', to: '/', icon: House },
  { label: 'Clientes', shortLabel: 'Clientes', to: '/clients', icon: Users },
]

const CHROMELESS_PATHS = new Set<string>(['/login', '/forbidden'])

function AppNavigationLink({
  item,
  mobile = false,
}: {
  item: NavigationItem
  mobile?: boolean
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isActive =
    item.to === '/'
      ? pathname === '/'
      : pathname === item.to || pathname.startsWith(`${item.to}/`)
  const Icon = item.icon

  return (
    <Link
      to={item.to}
      preload="intent"
      aria-current={isActive ? 'page' : undefined}
      className={
        mobile
          ? `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
          : `sidebar-nav-link ${isActive ? 'sidebar-nav-link-active' : ''}`
      }
    >
      <Icon
        size={mobile ? 19 : 18}
        strokeWidth={isActive ? 2.2 : 1.8}
        aria-hidden="true"
      />
      <span>{mobile ? item.shortLabel : item.label}</span>
    </Link>
  )
}

export function AppShell({ children, headerAccessory }: AppShellProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  if (CHROMELESS_PATHS.has(pathname)) {
    return <>{children}</>
  }

  return (
    <div className="min-h-dvh bg-[#f5f6fb] text-slate-950">
      <div className="sticky top-0 z-40">
        <header className="border-b border-slate-900/6 bg-[#f5f6fb]/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <BrandMark />
            {headerAccessory}
          </div>
        </header>
      </div>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-[72px] hidden h-[calc(100dvh-72px)] w-[256px] shrink-0 flex-col px-6 py-8 lg:flex">
          <nav aria-label="Navegação principal" className="flex flex-col gap-1.5">
            {navigationItems.map((item) => (
              <AppNavigationLink key={item.to} item={item} />
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-28 pt-7 sm:px-6 sm:pt-9 lg:px-8 lg:pb-12 xl:px-10">
          {children}
        </main>
      </div>

      <nav aria-label="Navegação principal" className="mobile-nav lg:hidden">
        {navigationItems.map((item) => (
          <AppNavigationLink key={item.to} item={item} mobile />
        ))}
      </nav>
    </div>
  )
}
