/**
 * Domain Models, Credentials, and DTO contracts for Authentication
 * Fully mapped to occupify-identity microservice contracts.
 */

export type UserRole = 'FREELANCER' | 'CLIENT' | 'ADMIN' | 'freelancer' | 'client' | 'admin'
export type UserStatus = 'INACTIVE' | 'ACTIVE' | 'BANNED' | 'inactive' | 'active' | 'banned'

export interface AuthUser {
  id: string
  email: string
  role: string
  status: string
  createdAt?: string
  fullName?: string
  avatarUrl?: string
}

export interface UserProfile extends AuthUser {
  headline?: string
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

export interface AuthResponseData {
  accessToken: string
  refreshToken: string
  user?: AuthUser
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
  username?: string // Backward compatibility for legacy inputs
}

export interface SignUpCredentials {
  email: string
  password: string
  confirmPassword?: string
  username?: string
  school?: string
}

export interface VerifyOtpPayload {
  email: string
  otpCode: string
  type: 'REGISTER' | 'FORGOT_PASSWORD'
}

export interface SendOtpPayload {
  email: string
  type: 'REGISTER' | 'FORGOT_PASSWORD'
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  resetToken: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface VerifyOtpSuccessData {
  accessToken?: string
  refreshToken?: string
  user?: AuthUser
  resetToken?: string
}
