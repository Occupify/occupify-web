import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../api/get-current-user'
import { useAuthStore } from '@/stores'

export const AUTH_QUERY_KEYS = {
  all: ['auth'] as const,
  currentUser: ['auth', 'current-user'] as const,
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.currentUser,
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10, // Cache 10 phút
  })
}
