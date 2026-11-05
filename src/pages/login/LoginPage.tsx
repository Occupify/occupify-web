import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { OccupifyLogo } from '@/components/ui'
import { LoginForm } from '@/features/auth'
import type { AuthResponseData } from '@/features/auth/types'
import { useAuthStore } from '@/stores'

export interface LoginPageProps {
  onBack?: () => void
  onSuccess?: () => void
  onGoogle?: () => void
  onSignUp?: () => void
}

export function LoginPage({ onSuccess, onGoogle, onSignUp }: LoginPageProps) {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  // If already authenticated, redirect immediately according to role
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role?.toUpperCase() === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/home', { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate])

  const redirectByRole = React.useCallback(
    (authData?: AuthResponseData) => {
      const role = authData?.user?.role || useAuthStore.getState().user?.role
      if (role?.toUpperCase() === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/home', { replace: true })
      }
    },
    [navigate],
  )

  const handleSuccess = React.useCallback(
    (authData?: AuthResponseData) => {
      if (onSuccess) {
        onSuccess()
      } else {
        redirectByRole(authData)
      }
    },
    [onSuccess, redirectByRole],
  )

  const handleGoogle = React.useCallback(
    (authData?: AuthResponseData) => {
      if (onGoogle) {
        onGoogle()
      } else {
        redirectByRole(authData)
      }
    },
    [onGoogle, redirectByRole],
  )

  const handleSignUp = React.useCallback(() => {
    if (onSignUp) {
      onSignUp()
    } else {
      navigate('/signup')
    }
  }, [onSignUp, navigate])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base, #F8FAFC)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        position: 'relative',
        fontFamily:
          "'Plus Jakarta Sans', 'Inter', 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Logo centered above card */}
      <div style={{ marginBottom: 24 }}>
        <OccupifyLogo size={36} />
      </div>

      {/* Main card */}
      <LoginForm onSuccess={handleSuccess} onGoogle={handleGoogle} onSignUp={handleSignUp} />

      {/* Legal text */}
      <p
        style={{
          marginTop: 24,
          fontSize: 12,
          color: 'rgba(0,0,0,0.60)',
          textAlign: 'center',
          maxWidth: 384,
          lineHeight: 1.5,
        }}
      >
        Bằng cách tiếp tục, bạn đồng ý với{' '}
        <span style={{ color: '#0A66C2', cursor: 'pointer', fontWeight: 600 }}>
          Điều khoản dịch vụ
        </span>{' '}
        và{' '}
        <span style={{ color: '#0A66C2', cursor: 'pointer', fontWeight: 600 }}>
          Chính sách quyền riêng tư
        </span>{' '}
        của Occupify.
      </p>
    </div>
  )
}

export default LoginPage
