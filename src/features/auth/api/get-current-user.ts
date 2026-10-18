import type { UserProfile } from '../types'
import { useAuthStore } from '@/stores'

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
 * Uses cached auth session user from occupify-identity if available.
 */
export async function getCurrentUser(): Promise<UserProfile> {
  const storeUser = useAuthStore.getState().user
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
