import { apiClient } from '@/lib/api-client'
import type { SingleResponse } from '@/types'
import type { LoginCredentials, AuthResponseData, AuthTokens } from '../types'
import { authResponseEnvelopeSchema } from './schemas'

// Dumb session tokens for isolated component testing or fallback
export const MOCK_AUTH_TOKENS: AuthTokens = {
  accessToken: 'mock_jwt_access_token_occupify_khoanm_2026',
  refreshToken: 'mock_jwt_refresh_token_occupify_khoanm_2026',
  expiresIn: 3600,
}

/**
 * Authenticates user credentials against the occupify-identity service via API Gateway.
 * Endpoint: POST /auth/login
 */
export async function loginApi(credentials: LoginCredentials): Promise<AuthResponseData> {
  const email = (credentials.email || credentials.username || '').trim()
  const password = credentials.password || ''

  const raw = await apiClient.post<SingleResponse<AuthResponseData>>('/auth/login', {
    email,
    password,
  })

  const validated = authResponseEnvelopeSchema.parse(raw)
  return validated.data
}
