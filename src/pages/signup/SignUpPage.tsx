import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { OccupifyLogo } from '@/components/ui'
import { SignUpFlow } from '@/features/auth'

export interface SignUpPageProps {
  onBack?: () => void
  onSuccess?: () => void
  onGoogle?: () => void
  onLogin?: () => void
}

export function SignUpPage({ onBack, onSuccess, onGoogle, onLogin }: SignUpPageProps) {
  const navigate = useNavigate()
  const [step, setStep] = React.useState(0)

  const handleBack = React.useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1)
    } else if (onBack) {
      onBack()
    } else {
      navigate('/')
    }
  }, [step, onBack, navigate])

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

  const handleLogin = React.useCallback(() => {
    if (onLogin) {
      onLogin()
    } else {
      navigate('/login')
    }
  }, [onLogin, navigate])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F4F2EE',
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
      {/* Back button — absolute top-left, outside card */}
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
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          color: 'rgba(0,0,0,0.60)',
          fontFamily: 'inherit',
          padding: '4px 0',
          transition: 'color 150ms ease',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.90)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.60)'
        }}
      >
        <ArrowLeftIcon size={14} weight="bold" />
        <span>{step === 0 ? 'Quay lại' : 'Bước trước'}</span>
      </button>

      {/* Logo centered above card */}
      <div style={{ marginBottom: 28 }}>
        <OccupifyLogo size={36} />
      </div>

      <SignUpFlow
        step={step}
        onStepChange={setStep}
        onSuccess={handleSuccess}
        onGoogle={handleGoogle}
        onLogin={handleLogin}
      />

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

export default SignUpPage
