import { useMutation, useQueryClient } from '@tanstack/react-query'
import { googleLoginApi } from '../api/login'
import { useAuthStore } from '@/stores'
import { AUTH_QUERY_KEYS } from './use-current-user'
import type { AuthResponseData } from '../types'

/**
 * Mutation hook for Google authentication.
 * Encapsulates session token persistence and query cache invalidation,
 * ensuring UI components remain decoupled from store mutation logic.
 */
export function useGoogleLogin() {
  const queryClient = useQueryClient()
  const setTokens = useAuthStore((state) => state.setTokens)

  return useMutation<AuthResponseData, Error, string>({
    mutationFn: (idToken: string) => googleLoginApi(idToken),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken, data.user)
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.all })
    },
  })
}
