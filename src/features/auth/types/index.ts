export type UserRole = 'freelancer' | 'client' | 'admin'

export interface UserProfile {
  id: string
  fullName: string
  email: string
  avatarUrl?: string
  headline?: string
  role?: UserRole
  connectionsCount?: number
  walletBalance?: number
  myProjectsCount?: number
  employeeProjectsCount?: number
  pendingProjectsCount?: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn?: number
}
