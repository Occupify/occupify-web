import { GoogleButton } from '@/features/auth'

export interface AuthPanelProps {
  onLogin: () => void
  onSignUp: () => void
  onGoogle: () => void
  onAdmin: () => void
}

export function AuthPanel({ onLogin, onSignUp, onGoogle, onAdmin }: AuthPanelProps) {
  return (
    <div
      style={{
        flex: '1 1 46%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px 36px',
        background: '#F8FAFC',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow:
            '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)',
          padding: '40px 36px',
        }}
      >
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: 6,
            letterSpacing: '-0.02em',
          }}
        >
          Chào mừng trở lại
        </h2>
        <p
          style={{
            fontSize: 14,
            color: '#64748B',
            marginBottom: 28,
            lineHeight: 1.5,
          }}
        >
          Đăng nhập hoặc tạo tài khoản mới để bắt đầu khám phá cơ hội.
        </p>

        <button
          type="button"
          onClick={onLogin}
          style={{
            width: '100%',
            padding: '11px 20px',
            borderRadius: 8,
            border: 'none',
            background: '#0A66C2',
            color: '#fff',
            fontSize: 14.5,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginBottom: 10,
            boxShadow: '0 1px 2px 0 rgba(10, 102, 194, 0.3)',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = '#084FA0'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = '#0A66C2'
          }}
        >
          Đăng nhập
        </button>

        <button
          type="button"
          onClick={onSignUp}
          style={{
            width: '100%',
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid #CBD5E1',
            background: '#fff',
            color: '#0F172A',
            fontSize: 14.5,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            marginBottom: 20,
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = '#F8FAFC'
            ;(e.currentTarget as HTMLElement).style.borderColor = '#94A3B8'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.background = '#fff'
            ;(e.currentTarget as HTMLElement).style.borderColor = '#CBD5E1'
          }}
        >
          Đăng ký tài khoản
        </button>

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

        <GoogleButton onClick={onGoogle} label="Tiếp tục với Google" />

        <p
          style={{
            marginTop: 28,
            fontSize: 12,
            color: '#94A3B8',
            textAlign: 'center',
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
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button
            type="button"
            onClick={onAdmin}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12.5,
              color: '#64748B',
              fontFamily: 'inherit',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: 6,
              transition: 'all 150ms',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = '#0A66C2'
              ;(e.currentTarget as HTMLElement).style.background = '#EFF6FF'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = '#64748B'
              ;(e.currentTarget as HTMLElement).style.background = 'none'
            }}
          >
            Truy cập Admin Portal →
          </button>
        </div>
      </div>
    </div>
  )
}
