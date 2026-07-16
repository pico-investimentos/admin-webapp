import type { PropsWithChildren } from 'react'
import { MotionConfig } from 'motion/react'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/app/query-client'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </QueryClientProvider>
  )
}
