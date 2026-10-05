import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { OccupifyLogo } from '@/components/ui'
import { LoginForm } from '@/features/auth'

export interface LoginPageProps {
  onBack?: () => void
  onSuccess?: () => void
  onGoogle?: () => void
  onSignUp?: () => void
}

export function LoginPage({ onBack, onSuccess, onGoogle, onSignUp }: LoginPageProps) {
  const navigate = useNavigate()

  const handleBack = React.useCallback(() => {
    if (onBack) {
      onBack()
    } else {
      navigate('/')
    }
  }, [onBack, navigate])

  const handleSuccess = React.useCallback(() => {
    if (onSuccess) {
      onSuccess()
    } else {
      navigate('/home')
    }
  }, [onSuccess, navigate])

  const handleGoogle = React.useCallback(() => {
    if (onGoogle) {
      onGoogle()
    } else {
      navigate('/home')
    }
  }, [onGoogle, navigate])

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
        background: 'var(--bg-base, #F4F2EE)',
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
      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#fff',
          border: '1px solid #CBD5E1',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
          color: '#475569',
          fontFamily: 'inherit',
          padding: '6px 12px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          transition: 'all 150ms ease',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.color = '#0F172A'
          ;(e.currentTarget as HTMLElement).style.borderColor = '#94A3B8'
          ;(e.currentTarget as HTMLElement).style.background = '#F1F5F9'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.color = '#475569'
          ;(e.currentTarget as HTMLElement).style.borderColor = '#CBD5E1'
          ;(e.currentTarget as HTMLElement).style.background = '#fff'
        }}
      >
        <ArrowLeftIcon size={14} weight="bold" />
        <span>Quay lại</span>
      </button>

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
