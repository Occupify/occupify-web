import React, { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from '@/components/feedback'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      refetchOnWindowFocus: false,
    },
  },
})

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div style={{ padding: '20px' }}>Loading...</div>}>
        {children}
        <ToastContainer position="bottom-right" />
      </Suspense>
    </QueryClientProvider>
  )
}
