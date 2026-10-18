import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loginApi } from '../api/login'
import type { LoginCredentials, AuthResponseData } from '../types'
import { useAuthStore } from '@/stores'
import { AUTH_QUERY_KEYS } from './use-current-user'

export function useLogin() {
  const queryClient = useQueryClient()
  const setTokens = useAuthStore((state) => state.setTokens)

  return useMutation<AuthResponseData, Error, LoginCredentials>({
    mutationFn: (credentials) => loginApi(credentials),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken, data.user)
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.all })
    },
  })
}
