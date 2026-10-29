import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores'
import type { SingleResponse, SuccessResponse } from '@/types'
import {
  singleAccountResponseEnvelopeSchema,
  avatarResponseEnvelopeSchema,
  successResponseEnvelopeSchema,
} from './schemas'
import type {
  AccountProfile,
  UpdateAccountPayload,
  AvatarUploadResponse,
  UpdateBasicInfoPayload,
  ProfileData,
} from '../types'
import { currentProfileState } from './profile-state'

/**
 * Retrieves the profile of the currently authenticated user account.
 * Endpoint: GET /users/me
 */
export async function getAccountProfileApi(): Promise<AccountProfile> {
  const raw = await apiClient.get<SingleResponse<AccountProfile>>('/users/me')
  const parsed = singleAccountResponseEnvelopeSchema.parse(raw)
  return parsed.data
}

/**
 * Updates personal details of the current user account.
 * Endpoint: PUT /users/me
 */
export async function updateAccountProfileApi(
  payload: UpdateAccountPayload,
): Promise<AccountProfile> {
  const raw = await apiClient.put<SingleResponse<AccountProfile>>('/users/me', payload)
  const parsed = singleAccountResponseEnvelopeSchema.parse(raw)
  return parsed.data
}

/**
 * Self-deletes (soft delete) the current user account.
 * Endpoint: DELETE /users/me
 */
export async function deleteAccountApi(): Promise<void> {
  const raw = await apiClient.delete<SuccessResponse>('/users/me')
  successResponseEnvelopeSchema.parse(raw)
}

/**
 * Uploads a new avatar image for the authenticated user account.
 * Endpoint: POST /users/me/avatar
 */
export async function uploadAvatarApi(file: File): Promise<AvatarUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const raw = await apiClient.post<SingleResponse<AvatarUploadResponse>>(
    '/users/me/avatar',
    formData,
  )
  const parsed = avatarResponseEnvelopeSchema.parse(raw)
  return parsed.data
}

/**
 * Deletes current user avatar image and resets avatarUrl to null.
 * Endpoint: DELETE /users/me/avatar
 */
export async function deleteAvatarApi(): Promise<void> {
  const raw = await apiClient.delete<SuccessResponse>('/users/me/avatar')
  successResponseEnvelopeSchema.parse(raw)
}

/**
 * Update basic user information (Name, Headline, Location, Bio/Intro)
 * Synchronizes with PUT /users/me and updates global session
 */
export async function updateBasicInfoApi(payload: UpdateBasicInfoPayload): Promise<ProfileData> {
  if (useAuthStore.getState().isAuthenticated) {
    try {
      await apiClient.put('/users/me', {
        fullName: payload.name,
        headline: payload.headline,
        bio: payload.intro,
      })

      const currentUser = useAuthStore.getState().user
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          fullName: payload.name,
        })
      }
    } catch (err) {
      console.warn('[updateBasicInfoApi] Backend put /users/me failed, updating locally:', err)
    }
  }

  currentProfileState.data = {
    ...currentProfileState.data,
    name: payload.name,
    headline: payload.headline,
    location: payload.location ?? currentProfileState.data.location,
    intro: payload.intro,
  }
  return { ...currentProfileState.data }
}
