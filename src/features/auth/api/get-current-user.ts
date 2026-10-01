import type { UserProfile } from '../types'

// Dữ liệu mô phỏng thông tin người dùng đang đăng nhập (Mock Current User payload)
const MOCK_CURRENT_USER: UserProfile = {
  id: 'usr_01jk98m',
  fullName: 'Nguyễn Minh Khoa',
  email: 'nguyenminhkhoa@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  headline: 'Senior UI/UX Designer & Product Architect',
  role: 'freelancer',
  connectionsCount: 534,
  walletBalance: 52450000,
  myProjectsCount: 2,
  employeeProjectsCount: 2,
  pendingProjectsCount: 2,
}

/**
 * Fetches the currently authenticated user's profile information.
 *
 * NOTE: Currently mocks the network response. When backend endpoint is available,
 * replace this implementation with:
 *
 * ```ts
 * import { apiClient } from '@/lib/api-client'
 * const response = await apiClient.get<UserProfile>('/auth/me')
 * return response.data
 * ```
 */
export async function getCurrentUser(): Promise<UserProfile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CURRENT_USER)
    }, 120)
  })
}
