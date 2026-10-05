import type { LoginCredentials, AuthTokens } from '../types'

// Dữ liệu mô phỏng phiên đăng nhập (Dumb session tokens for dev/prototype)
export const MOCK_AUTH_TOKENS: AuthTokens = {
  accessToken: 'mock_jwt_access_token_occupify_khoanm_2026',
  refreshToken: 'mock_jwt_refresh_token_occupify_khoanm_2026',
  expiresIn: 3600,
}

/**
 * Signs in a user with username/email and password credentials.
 *
 * NOTE: Currently mocks the network response. When backend endpoint is available:
 * ```ts
 * import { apiClient } from '@/lib/api-client'
 * const response = await apiClient.post<AuthTokens>('/auth/login', credentials)
 * return response.data
 * ```
 */
export async function loginApi(credentials: LoginCredentials): Promise<AuthTokens> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!credentials.username.trim()) {
        reject(new Error('Tên đăng nhập không được để trống.'))
        return
      }
      resolve(MOCK_AUTH_TOKENS)
    }, 120)
  })
}
