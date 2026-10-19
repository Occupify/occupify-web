import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import type { CredentialResponse } from '@react-oauth/google'
import { BrandPanel, AuthPanel } from './components'
import { useGoogleLogin } from '@/features/auth/hooks'
import { getAuthErrorMessage } from '@/features/auth/utils'
import { toast } from '@/stores'

export interface LandingPageProps {
  onLogin?: () => void
  onSignUp?: () => void
  onGoogle?: () => void
  onAdmin?: () => void
}

/**
 * LandingPage
 *
 * Exact match of Occupify-website-design Landing Page.
 * Orchestrates the Left Brand Panel and the Right Auth Panel.
 */
export function LandingPage({ onLogin, onSignUp, onGoogle, onAdmin }: LandingPageProps) {
  const navigate = useNavigate()
  const googleLoginMutation = useGoogleLogin()

  const handleLogin = React.useCallback(() => {
    if (onLogin) {
      onLogin()
    } else {
      navigate('/login')
    }
  }, [onLogin, navigate])

  const handleSignUp = React.useCallback(() => {
    if (onSignUp) {
      onSignUp()
    } else {
      navigate('/signup')
    }
  }, [onSignUp, navigate])

  const handleGoogle = React.useCallback(() => {
    if (onGoogle) {
      onGoogle()
    } else {
      navigate('/home')
    }
  }, [onGoogle, navigate])

  const handleGoogleSuccess = React.useCallback(
    async (credentialResponse: CredentialResponse) => {
      if (!credentialResponse.credential) {
        toast.error('Không nhận được thông tin xác thực từ Google.')
        return
      }
      try {
        await googleLoginMutation.mutateAsync(credentialResponse.credential)
        if (onGoogle) {
          onGoogle()
        } else {
          navigate('/home')
        }
      } catch (err: unknown) {
        toast.error(getAuthErrorMessage(err, 'Đăng nhập bằng Google không thành công.'))
      }
    },
    [googleLoginMutation, onGoogle, navigate],
  )

  const handleAdmin = React.useCallback(() => {
    if (onAdmin) {
      onAdmin()
    } else {
      navigate('/admin')
    }
  }, [onAdmin, navigate])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base, #F4F2EE)',
        display: 'flex',
        alignItems: 'stretch',
        fontFamily:
          "'Plus Jakarta Sans', 'Inter', 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Left — brand panel */}
      <BrandPanel />

      {/* Right — auth panel */}
      <AuthPanel
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onGoogle={handleGoogle}
        onGoogleSuccess={handleGoogleSuccess}
        onAdmin={handleAdmin}
      />
    </div>
  )
}

export default LandingPage
