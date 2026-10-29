import type { UserProfile } from '../types'
import { useAuthStore } from '@/stores'
import { getAccountProfileApi } from '@/features/profile'

// Fallback user for offline prototype demonstration
const MOCK_CURRENT_USER: UserProfile = {
  id: 'usr_01jk98m',
  fullName: 'Nguyễn Minh Khoa',
  email: 'nguyenminhkhoa@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  headline: 'Senior UI/UX Designer & Product Architect',
  role: 'FREELANCER',
  status: 'ACTIVE',
  connectionsCount: 534,
  walletBalance: 52450000,
  myProjectsCount: 2,
  employeeProjectsCount: 2,
  pendingProjectsCount: 2,
}

/**
 * Fetches the currently authenticated user's profile information.
 * Calls backend GET /users/me if authenticated, with offline fallback.
 */
export async function getCurrentUser(): Promise<UserProfile> {
  const { isAuthenticated, accessToken, user: storeUser } = useAuthStore.getState()

  if (isAuthenticated && accessToken) {
    try {
      const accountProfile = await getAccountProfileApi()
      const mergedUser: UserProfile = {
        ...MOCK_CURRENT_USER,
        ...accountProfile,
        id: accountProfile.id,
        email: accountProfile.email,
        role: accountProfile.role,
        status: accountProfile.status,
        fullName: accountProfile.fullName || accountProfile.email.split('@')[0],
        avatarUrl: accountProfile.avatarUrl ?? null,
        headline: accountProfile.headline ?? undefined,
      }

      // Sync active profile back to Zustand auth store
      useAuthStore.getState().setUser({
        id: mergedUser.id,
        email: mergedUser.email,
        role: mergedUser.role,
        status: mergedUser.status,
        fullName: mergedUser.fullName,
        avatarUrl: mergedUser.avatarUrl,
        createdAt: accountProfile.createdAt,
      })

      return mergedUser
    } catch {
      // Downstream failure or offline: fallback to stored session or mock
    }
  }

  if (storeUser) {
    return {
      ...MOCK_CURRENT_USER,
      ...storeUser,
      id: storeUser.id,
      email: storeUser.email,
      role: storeUser.role,
      status: storeUser.status,
      fullName: storeUser.fullName || storeUser.email.split('@')[0],
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CURRENT_USER)
    }, 50)
  })
}
