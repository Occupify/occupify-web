import { create } from 'zustand'

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setTokens: (accessToken: string, refreshToken: string) => void
  clearTokens: () => void
}

// Dữ liệu mô phỏng phiên đăng nhập (Dumb session tokens for dev/prototype)
const INITIAL_MOCK_ACCESS_TOKEN = 'mock_jwt_access_token_occupify_khoanm_2026'
const INITIAL_MOCK_REFRESH_TOKEN = 'mock_jwt_refresh_token_occupify_khoanm_2026'

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: INITIAL_MOCK_ACCESS_TOKEN,
  refreshToken: INITIAL_MOCK_REFRESH_TOKEN,
  isAuthenticated: true,

  setTokens: (accessToken: string, refreshToken: string) =>
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
    }),

  clearTokens: () =>
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }),
}))
