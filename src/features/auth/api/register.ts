import { apiClient } from '@/lib/api-client'
import type { CreatedResponse } from '@/types'
import type { SignUpCredentials } from '../types'
import { createdResponseEnvelopeSchema } from './schemas'

/**
 * Registers a new user account in occupify-identity.
 * Publishes UserRegisteredEvent to RabbitMQ -> occupify-noti sends 6-digit OTP email.
 * Endpoint: POST /auth/register
 */
export async function registerApi(credentials: SignUpCredentials): Promise<CreatedResponse<void>> {
  const email = (credentials.email || credentials.username || '').trim()
  const password = credentials.password || ''

  const raw = await apiClient.post<CreatedResponse<void>>('/auth/register', {
    email,
    password,
  })

  return createdResponseEnvelopeSchema.parse(raw) as CreatedResponse<void>
}
