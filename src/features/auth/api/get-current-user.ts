import type { UserProfile } from '../types'
import { useAuthStore } from '@/stores'
import { getAccountProfileApi } from '@/features/profile'

// Fallback baseline structure for anonymous / offline fallback
const BASE_DEFAULT_USER: UserProfile = {
  id: '',
  fullName: '',
  email: '',
  avatarUrl: null,
  headline: '',
  role: 'FREELANCER',
  status: 'ACTIVE',
  connectionsCount: 0,
  walletBalance: 0,
  myProjectsCount: 0,
  employeeProjectsCount: 0,
  pendingProjectsCount: 0,
}

/**
 * Fetches the currently authenticated user's profile information.
 * Calls backend GET /users/me if authenticated.
 */
export async function getCurrentUser(): Promise<UserProfile> {
  const { isAuthenticated, accessToken, user: storeUser } = useAuthStore.getState()

  if (isAuthenticated && accessToken) {
    try {
      const accountProfile = await getAccountProfileApi()
      const resolvedName =
        accountProfile.fullName || storeUser?.fullName || accountProfile.email.split('@')[0]
      const resolvedAvatar = accountProfile.avatarUrl ?? storeUser?.avatarUrl ?? null
      const resolvedHeadline = accountProfile.headline ?? storeUser?.headline ?? undefined

      const mergedUser: UserProfile = {
        ...BASE_DEFAULT_USER,
        ...accountProfile,
        id: accountProfile.id,
        email: accountProfile.email,
        role: accountProfile.role,
        status: accountProfile.status,
        fullName: resolvedName,
        avatarUrl: resolvedAvatar,
        headline: resolvedHeadline,
      }

      // Sync active profile back to Zustand auth store
      useAuthStore.getState().setUser({
        id: mergedUser.id,
        email: mergedUser.email,
        role: mergedUser.role,
        status: mergedUser.status,
        fullName: mergedUser.fullName,
        avatarUrl: mergedUser.avatarUrl,
        headline: mergedUser.headline,
        createdAt: accountProfile.createdAt,
      })

      return mergedUser
    } catch {
      // Downstream failure or offline: fallback to stored session
    }
  }

  if (storeUser) {
    return {
      ...BASE_DEFAULT_USER,
      ...storeUser,
      id: storeUser.id,
      email: storeUser.email,
      role: storeUser.role,
      status: storeUser.status,
      fullName: storeUser.fullName || storeUser.email.split('@')[0],
      avatarUrl: storeUser.avatarUrl ?? null,
      headline: storeUser.headline,
    }
  }

  return { ...BASE_DEFAULT_USER }
}
