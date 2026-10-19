import React, { Suspense, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastContainer } from '@/components/feedback'
import { toast } from '@/stores'
import { ApiError } from '@/types'
import { env } from '@/config/env'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Do not retry 4xx client errors (400, 401, 403, 404, 409, 429)
        if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    const handleSessionExpired = () => {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.', {
        title: 'Hết phiên làm việc',
      })
    }

    window.addEventListener('occupify:session-expired', handleSessionExpired)
    return () => window.removeEventListener('occupify:session-expired', handleSessionExpired)
  }, [])

  return (
    <GoogleOAuthProvider clientId={env.googleClientId || ''}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div style={{ padding: '20px' }}>Loading...</div>}>
          {children}
          <ToastContainer position="bottom-right" />
        </Suspense>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}
