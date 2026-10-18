import { apiClient } from '@/lib/api-client'
import type { CreatedResponse } from '@/types'
import type { SignUpCredentials, AuthUser } from '../types'
import { userResponseEnvelopeSchema } from './schemas'

/**
 * Registers a new user account in occupify-identity.
 * Publishes UserRegisteredEvent to RabbitMQ -> occupify-noti sends 6-digit OTP email.
 * Endpoint: POST /auth/register
 */
export async function registerApi(credentials: SignUpCredentials): Promise<AuthUser> {
  const email = (credentials.email || credentials.username || '').trim()
  const password = credentials.password || ''

  const raw = await apiClient.post<CreatedResponse<AuthUser>>('/auth/register', {
    email,
    password,
  })

  const validated = userResponseEnvelopeSchema.parse(raw)
  return validated.data
}
