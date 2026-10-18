import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { OccupifyLogo } from '@/components/ui'
import { SignUpFlow } from '@/features/auth'

export interface SignUpPageProps {
  onBack?: () => void
  onSuccess?: () => void
  onGoogle?: () => void
  onLogin?: () => void
}

export function SignUpPage({ onSuccess, onGoogle, onLogin }: SignUpPageProps) {
  const navigate = useNavigate()
  const [step, setStep] = React.useState(0)

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
