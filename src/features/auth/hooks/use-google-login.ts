import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MOCK_AUTH_TOKENS } from '../api/login'
import { useAuthStore } from '@/stores'
import { AUTH_QUERY_KEYS } from './use-current-user'
import type { AuthTokens } from '../types'

/**
 * Mutation hook for Google authentication.
 * Encapsulates session token persistence and query cache invalidation,
 * ensuring UI components remain decoupled from store mutation logic.
 */
export function useGoogleLogin() {
  const queryClient = useQueryClient()
  const setTokens = useAuthStore((state) => state.setTokens)

  return useMutation<AuthTokens, Error, void>({
    mutationFn: async () => {
      // Prototype placeholder; will integrate with backend OAuth endpoint when ready
      return MOCK_AUTH_TOKENS
    },
    onSuccess: (tokens) => {
      setTokens(tokens.accessToken, tokens.refreshToken)
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.all })
    },
  })
}
