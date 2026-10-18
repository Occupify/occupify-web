import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signOutApi } from '../api/sign-out'
import { useAuthStore } from '@/stores'
import { AUTH_QUERY_KEYS } from './use-current-user'
import type { SuccessResponse } from '@/types'

export function useSignOut() {
  const queryClient = useQueryClient()
  const clearTokens = useAuthStore((state) => state.clearTokens)
  const storedRefreshToken = useAuthStore((state) => state.refreshToken)

  return useMutation<SuccessResponse, Error, string | undefined>({
    mutationFn: (refreshToken) => signOutApi(refreshToken ?? storedRefreshToken ?? undefined),
    onSettled: () => {
      clearTokens()
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.all })
    },
  })
}
