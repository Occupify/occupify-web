import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProfileApi,
  getAccountProfileApi,
  updateAccountProfileApi,
  deleteAccountApi,
  uploadAvatarApi,
  deleteAvatarApi,
  updateBasicInfoApi,
} from '../api'
import type { UpdateAccountPayload, UpdateBasicInfoPayload } from '../types'
import { useAuthStore } from '@/stores'
import { AUTH_QUERY_KEYS } from '@/features/auth'

export const PROFILE_QUERY_KEYS = {
  all: ['profile'] as const,
  profile: ['profile', 'me'] as const,
  account: ['profile', 'account'] as const,
}

export const ACCOUNT_QUERY_KEYS = PROFILE_QUERY_KEYS

/**
 * Hook to retrieve full 360-degree profile (or partner profile).
 * Endpoint: GET /users/me/detail
 */
export function useProfile(userName?: string) {
  return useQuery({
    queryKey: ['profile', userName || 'me'],
    queryFn: () => getProfileApi(userName),
  })
}

/**
 * Hook to retrieve the current user's basic account profile from backend.
 * Endpoint: GET /users/me
 */
export function useAccountProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.account,
    queryFn: getAccountProfileApi,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Hook to update account profile details.
 * Endpoint: PUT /users/me
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateAccountPayload) => updateAccountProfileApi(payload),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.currentUser })

      const currentUser = useAuthStore.getState().user
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          fullName: updatedProfile.fullName || currentUser.fullName,
          avatarUrl: updatedProfile.avatarUrl ?? currentUser.avatarUrl,
        })
      }
    },
  })
}

/**
 * Hook to update basic profile information (fullName, headline, bio).
 * Endpoint: PUT /users/me
 */
export function useUpdateBasicInfo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateBasicInfoPayload) => updateBasicInfoApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.currentUser })
    },
  })
}

/**
 * Hook to self-deactivate (soft-delete) the current user account.
 * Endpoint: DELETE /users/me
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteAccountApi(),
    onSuccess: () => {
      queryClient.clear()
      useAuthStore.getState().clearTokens()
    },
  })
}

/**
 * Hook to upload and update avatar image.
 * Endpoint: POST /users/me/avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadAvatarApi(file),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.currentUser })

      const currentUser = useAuthStore.getState().user
      if (currentUser && response.avatarUrl) {
        useAuthStore.getState().setUser({
          ...currentUser,
          avatarUrl: response.avatarUrl,
        })
      }
    },
  })
}

/**
 * Hook to remove avatar image.
 * Endpoint: DELETE /users/me/avatar
 */
export function useDeleteAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteAvatarApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.currentUser })

      const currentUser = useAuthStore.getState().user
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          avatarUrl: null,
        })
      }
    },
  })
}
