import { useMutation, useQueryClient } from '@tanstack/react-query'
import { verifyOtpApi } from '../api/verify-otp'
import type { VerifyOtpPayload, VerifyOtpSuccessData } from '../types'
import { useAuthStore } from '@/stores'
import { AUTH_QUERY_KEYS } from './use-current-user'

export function useVerifyOtp() {
  const queryClient = useQueryClient()
  const setTokens = useAuthStore((state) => state.setTokens)

  return useMutation<VerifyOtpSuccessData, Error, VerifyOtpPayload>({
    mutationFn: (payload) => verifyOtpApi(payload),
    onSuccess: (data) => {
      if (data.accessToken && data.refreshToken) {
        setTokens(data.accessToken, data.refreshToken, data.user)
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.all })
      }
    },
  })
}
