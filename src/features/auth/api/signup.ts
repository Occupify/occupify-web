import type { SignUpCredentials, AuthTokens } from '../types'
import { MOCK_AUTH_TOKENS } from './login'

/**
 * Registers a new user account with credentials and optional onboarding school.
 *
 * NOTE: Currently mocks the network response. When backend endpoint is available:
 * ```ts
 * import { apiClient } from '@/lib/api-client'
 * const response = await apiClient.post<AuthTokens>('/auth/signup', credentials)
 * return response.data
 * ```
 */
export async function signupApi(credentials: SignUpCredentials): Promise<AuthTokens> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!credentials.username.trim() || !credentials.email?.trim()) {
        reject(new Error('Vui lòng điền đầy đủ thông tin đăng ký.'))
        return
      }
      resolve(MOCK_AUTH_TOKENS)
    }, 150)
  })
}
