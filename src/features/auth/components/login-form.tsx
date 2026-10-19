import * as React from 'react'
import type { CredentialResponse } from '@react-oauth/google'
import { AuthInput } from './auth-input'
import { GoogleButton } from './google-button'
import { useLogin, useGoogleLogin } from '../hooks'
import { getAuthErrorMessage } from '../utils'

export interface LoginFormProps {
  onSuccess?: () => void
  onGoogle?: () => void
  onSignUp?: () => void
}

export function LoginForm({ onSuccess, onGoogle, onSignUp }: LoginFormProps) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [rememberMe, setRememberMe] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const loginMutation = useLogin()
  const googleLoginMutation = useGoogleLogin()

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault()
    }
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.')
      return
    }

    try {
      setError(null)
      await loginMutation.mutateAsync({
        email: email.trim(),
        password,
        rememberMe,
      })
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err, 'Đăng nhập không thành công.'))
    }
  }

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Không nhận được thông tin xác thực từ Google.')
      return
    }
    try {
      setError(null)
      await googleLoginMutation.mutateAsync(credentialResponse.credential)
      if (onGoogle) {
        onGoogle()
      } else if (onSuccess) {
        onSuccess()
      }
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err, 'Đăng nhập bằng Google không thành công.'))
    }
  }

  const handleGoogleError = () => {
    setError('Đăng nhập bằng Google không thành công hoặc đã bị hủy.')
  }

  const isLoading = loginMutation.isPending || googleLoginMutation.isPending

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #E2E8F0',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)',
        padding: '36px 40px',
        width: '100%',
        maxWidth: 440,
        boxSizing: 'border-box',
      }}
    >
      <h2
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: 4,
          letterSpacing: '-0.02em',
        }}
      >
        Đăng nhập
      </h2>
      <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>
        Chào mừng bạn trở lại với Occupify!
      </p>

      {error && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 8,
            padding: '10px 14px',
            color: '#B91C1C',
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Nhập địa chỉ email của bạn"
          required
        />
        <AuthInput
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Nhập mật khẩu của bạn"
          required
        />

        {/* Remember me + Forgot password row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 10,
            marginBottom: 22,
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: '#334155',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                accentColor: '#0A66C2',
                width: 15,
                height: 15,
                cursor: 'pointer',
              }}
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>
          <button
            type="button"
            onClick={() => {}}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              color: '#0A66C2',
              fontFamily: 'inherit',
              padding: 0,
            }}
          >
            Quên mật khẩu?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '11px 20px',
            borderRadius: 8,
            border: 'none',
            background: isLoading ? '#94A3B8' : '#0A66C2',
            color: '#fff',
            fontSize: 14.5,
            fontWeight: 700,
            cursor: isLoading ? 'default' : 'pointer',
            fontFamily: 'inherit',
            marginBottom: 20,
            boxShadow: '0 1px 2px 0 rgba(10, 102, 194, 0.3)',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              ;(e.currentTarget as HTMLElement).style.background = '#084FA0'
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              ;(e.currentTarget as HTMLElement).style.background = '#0A66C2'
            }
          }}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>hoặc</span>
        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
      </div>

      <GoogleButton
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        label="Tiếp tục với Google"
        disabled={isLoading}
      />

      {/* Sign-up link */}
      <p
        style={{
          fontSize: 14,
          color: 'rgba(0,0,0,0.60)',
          textAlign: 'center',
          marginTop: 24,
          marginBottom: 0,
        }}
      >
        Chưa có tài khoản?{' '}
        <button
          type="button"
          onClick={onSignUp}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#0A66C2',
            fontWeight: 600,
            fontSize: 14,
            fontFamily: 'inherit',
            padding: 0,
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.textDecoration = 'underline'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.textDecoration = 'none'
          }}
        >
          Đăng ký ngay
        </button>
      </p>
    </div>
  )
}
