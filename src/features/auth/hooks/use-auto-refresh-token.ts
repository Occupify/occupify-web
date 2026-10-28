import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores'
import { refreshAuthToken } from '@/lib/api-client'
import { getJwtExpirationMs, isJwtExpired } from '../utils/jwt'

/**
 * Automatically refreshes accessToken before expiry and re-synchronizes
 * the session when the tab wakes up or regains focus.
 */
export function useAutoRefreshToken() {
  const { accessToken, refreshToken, isAuthenticated } = useAuthStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isRefreshingRef = useRef(false)

  const triggerRefresh = async () => {
    if (isRefreshingRef.current) return
    const currentRefresh = useAuthStore.getState().refreshToken
    if (!currentRefresh) {
      console.warn('[Auth] Không tìm thấy refresh token trong storage, bỏ qua auto refresh')
      return
    }

    isRefreshingRef.current = true
    try {
      console.info('[Auth] Đang tự động làm mới access token...')
      const newToken = await refreshAuthToken()
      console.info('[Auth] Đã làm mới access token thành công:', newToken.slice(0, 20) + '...')
    } catch (err) {
      console.error('[Auth] Tự động làm mới token thất bại:', err)
    } finally {
      isRefreshingRef.current = false
    }
  }

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!refreshToken) {
      return
    }

    // Proactively refresh if access token is missing or already expired/near expiry
    if (!accessToken || isJwtExpired(accessToken, 60000)) {
      void triggerRefresh()
      return
    }

    const expMs = getJwtExpirationMs(accessToken)
    if (!expMs) {
      return
    }

    const refreshInMs = Math.max(0, expMs - Date.now() - 60000)
    timerRef.current = setTimeout(() => {
      void triggerRefresh()
    }, refreshInMs)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [accessToken, refreshToken, isAuthenticated])

  // Listen to visibility & focus changes to refresh if expired while sleeping/inactive
  useEffect(() => {
    if (!refreshToken) return

    const handleActive = () => {
      if (document.visibilityState === 'visible') {
        const currentAccess = useAuthStore.getState().accessToken
        if (!currentAccess || isJwtExpired(currentAccess, 60000)) {
          void triggerRefresh()
        }
      }
    }

    window.addEventListener('visibilitychange', handleActive)
    window.addEventListener('focus', handleActive)

    return () => {
      window.removeEventListener('visibilitychange', handleActive)
      window.removeEventListener('focus', handleActive)
    }
  }, [refreshToken])
}
