/**
 * Verifies a 6-digit OTP code sent to user email.
 *
 * NOTE: Currently mocks the network response. When backend endpoint is available:
 * ```ts
 * import { apiClient } from '@/lib/api-client'
 * const response = await apiClient.post<{ valid: boolean }>('/auth/verify-otp', { email, code })
 * return response.data.valid
 * ```
 */
export async function verifyOtpApi(email: string, code: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || code.length < 6) {
        reject(new Error('Vui lòng nhập đủ 6 chữ số OTP.'))
        return
      }
      resolve(true)
    }, 100)
  })
}
