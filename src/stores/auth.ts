import { create } from 'zustand'
import type { AuthUser } from '@/features/auth/types'

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setTokens: (accessToken: string, refreshToken: string, user?: AuthUser | null) => void
  setUser: (user: AuthUser | null) => void
  clearTokens: () => void
}

const STORAGE_KEY = 'occupify_auth_session'

interface PersistedAuth {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
}

function loadPersistedAuth(): PersistedAuth {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null, user: null }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { accessToken: null, refreshToken: null, user: null }
    return JSON.parse(raw) as PersistedAuth
  } catch {
    return { accessToken: null, refreshToken: null, user: null }
  }
}

function savePersistedAuth(data: PersistedAuth): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage quota errors
  }
}

function clearPersistedAuth(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore storage errors
  }
}

const initialSession = loadPersistedAuth()

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: initialSession.accessToken,
  refreshToken: initialSession.refreshToken,
  user: initialSession.user,
  isAuthenticated: Boolean(initialSession.accessToken),

  setTokens: (accessToken: string, refreshToken: string, user?: AuthUser | null) => {
    set((state) => {
      const updatedUser = user !== undefined ? user : state.user
      savePersistedAuth({
        accessToken,
        refreshToken,
        user: updatedUser,
      })
      return {
        accessToken,
        refreshToken,
        user: updatedUser,
        isAuthenticated: true,
      }
    })
  },

  setUser: (user: AuthUser | null) => {
    set((state) => {
      savePersistedAuth({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user,
      })
      return { user }
    })
  },

  clearTokens: () => {
    clearPersistedAuth()
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    })
  },
}))
