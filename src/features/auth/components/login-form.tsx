import * as React from 'react'
import { AuthInput } from './auth-input'
import { GoogleButton } from './google-button'
import { loginApi, MOCK_AUTH_TOKENS } from '../api'
import { useAuthStore } from '@/stores'

export interface LoginFormProps {
  onSuccess?: () => void
  onGoogle?: () => void
  onSignUp?: () => void
}

export function LoginForm({ onSuccess, onGoogle, onSignUp }: LoginFormProps) {
  const [username, setUsername] = React.useState('nguyeminhkhoa@gmail.com')
  const [password, setPassword] = React.useState('123456')
  const [rememberMe, setRememberMe] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const setTokens = useAuthStore((state) => state.setTokens)

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault()
    }
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const tokens = await loginApi({ username, password, rememberMe })
      setTokens(tokens.accessToken, tokens.refreshToken)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đăng nhập không thành công.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogle = () => {
    setTokens(MOCK_AUTH_TOKENS.accessToken, MOCK_AUTH_TOKENS.refreshToken)
    if (onGoogle) {
      onGoogle()
    } else if (onSuccess) {
      onSuccess()
    }
  }

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
          label="Tên đăng nhập"
          value={username}
          onChange={setUsername}
          placeholder="Nhập tên đăng nhập hoặc email"
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

      <GoogleButton onClick={handleGoogle} label="Tiếp tục với Google" />

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
