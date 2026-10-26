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

    if (!isAuthenticated || !accessToken || !refreshToken) {
      return
    }

    const expMs = getJwtExpirationMs(accessToken)
    if (!expMs) {
      console.info('[Auth] Token không phải định dạng JWT có trường exp, bỏ qua lập lịch auto refresh')
      return
    }

    const now = Date.now()
    const refreshInMs = expMs - now - 60000

    if (refreshInMs <= 0) {
      void triggerRefresh()
    } else {
      timerRef.current = setTimeout(() => {
        void triggerRefresh()
      }, refreshInMs)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [accessToken, refreshToken, isAuthenticated])

  // Listen to visibility & focus changes to refresh if expired while sleeping/inactive
  useEffect(() => {
    if (!isAuthenticated || !refreshToken) return

    const handleActive = () => {
      if (document.visibilityState === 'visible') {
        const currentAccess = useAuthStore.getState().accessToken
        if (currentAccess && isJwtExpired(currentAccess, 60000)) {
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
  }, [isAuthenticated, refreshToken])
}
