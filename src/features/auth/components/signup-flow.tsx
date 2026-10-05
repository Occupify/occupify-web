import * as React from 'react'
import { CheckFatIcon } from '@phosphor-icons/react'
import { AuthInput } from './auth-input'
import { GoogleButton } from './google-button'
import { StepIndicator } from './step-indicator'
import { MOCK_SCHOOL_OPTIONS, MOCK_AUTH_TOKENS, signupApi, verifyOtpApi } from '../api'
import { useAuthStore } from '@/stores'

export interface SignUpFlowProps {
  onSuccess?: () => void
  onGoogle?: () => void
  onLogin?: () => void
  onStepChange?: (step: number) => void
  step?: number
}

export function SignUpFlow({
  onSuccess,
  onGoogle,
  onLogin,
  onStepChange,
  step: externalStep,
}: SignUpFlowProps) {
  const [internalStep, setInternalStep] = React.useState(0)
  const step = externalStep !== undefined ? externalStep : internalStep
  const setStep = React.useCallback(
    (newStep: number | ((prev: number) => number)) => {
      const nextVal = typeof newStep === 'function' ? newStep(step) : newStep
      setInternalStep(nextVal)
      if (onStepChange) {
        onStepChange(nextVal)
      }
    },
    [step, onStepChange],
  )

  // Step 0: credentials
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [pwError, setPwError] = React.useState('')

  // Step 1: OTP
  const [otp, setOtp] = React.useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = React.useState('')
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false)
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([])

  // Step 2: school
  const [school, setSchool] = React.useState('')
  const [schoolSearch, setSchoolSearch] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const TOTAL_STEPS = 3
  const setTokens = useAuthStore((state) => state.setTokens)

  const handleFinish = React.useCallback(async () => {
    try {
      setIsSubmitting(true)
      const tokens = await signupApi({
        username,
        email,
        password,
        confirmPassword,
        school,
      })
      setTokens(tokens.accessToken, tokens.refreshToken)
      if (onSuccess) {
        onSuccess()
      }
    } catch {
      // Fallback
      setTokens(MOCK_AUTH_TOKENS.accessToken, MOCK_AUTH_TOKENS.refreshToken)
      if (onSuccess) {
        onSuccess()
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [username, email, password, confirmPassword, school, setTokens, onSuccess])

  const handleGoogle = React.useCallback(() => {
    setTokens(MOCK_AUTH_TOKENS.accessToken, MOCK_AUTH_TOKENS.refreshToken)
    if (onGoogle) {
      onGoogle()
    } else if (onSuccess) {
      onSuccess()
    }
  }, [setTokens, onGoogle, onSuccess])

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 5) {
      otpRefs.current[idx + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const code = otp.join('')
    if (code.length < 6) {
      setOtpError('Vui lòng nhập đủ 6 chữ số.')
      return
    }

    try {
      setIsVerifyingOtp(true)
      setOtpError('')
      await verifyOtpApi(email || 'user@example.com', code)
      setStep(2)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Mã OTP không hợp lệ.'
      setOtpError(message)
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const filteredSchools = React.useMemo(() => {
    return MOCK_SCHOOL_OPTIONS.filter((s) => s.toLowerCase().includes(schoolSearch.toLowerCase()))
  }, [schoolSearch])

  const primaryBtn = (label: string, onClick: () => void, disabled?: boolean) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '11px 20px',
        borderRadius: 9999,
        border: 'none',
        background: disabled ? 'rgba(0,0,0,0.12)' : '#0A66C2',
        color: disabled ? 'rgba(0,0,0,0.35)' : '#fff',
        fontSize: 15,
        fontWeight: 700,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'inherit',
        transition: 'background 150ms',
        marginTop: 8,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          ;(e.currentTarget as HTMLElement).style.background = '#084FA0'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          ;(e.currentTarget as HTMLElement).style.background = '#0A66C2'
        }
      }}
    >
      {label}
    </button>
  )

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    border: '1.5px solid rgba(0,0,0,0.18)',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    color: 'rgba(0,0,0,0.90)',
    boxSizing: 'border-box',
    transition: 'border-color 150ms',
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
        padding: '32px',
        width: '100%',
        maxWidth: 448,
        boxSizing: 'border-box',
      }}
    >
      <StepIndicator current={step} total={TOTAL_STEPS} />

      {/* Step 0: Credentials */}
      {step === 0 && (
        <>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: 'rgba(0,0,0,0.90)',
              marginBottom: 4,
            }}
          >
            Tạo tài khoản
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(0,0,0,0.55)',
              marginBottom: 22,
            }}
          >
            Điền thông tin để bắt đầu hành trình của bạn.
          </p>
          <AuthInput
            label="Tên đăng nhập"
            value={username}
            onChange={setUsername}
            placeholder="Nhập tên đăng nhập"
            required
          />
          <AuthInput
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Nhập địa chỉ email"
            required
          />
          <AuthInput
            label="Mật khẩu"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Tối thiểu 8 ký tự"
            required
          />
          <AuthInput
            label="Xác nhận mật khẩu"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Nhập lại mật khẩu"
            required
          />
          {pwError && <p style={{ fontSize: 13, color: '#C03A2B', marginBottom: 10 }}>{pwError}</p>}
          {primaryBtn(
            'Tiếp tục',
            () => {
              if (
                !username.trim() ||
                !email.trim() ||
                !password.trim() ||
                !confirmPassword.trim()
              ) {
                setPwError('Vui lòng điền đầy đủ thông tin.')
                return
              }
              if (password !== confirmPassword) {
                setPwError('Mật khẩu không khớp.')
                return
              }
              if (password.length < 8) {
                setPwError('Mật khẩu phải có ít nhất 8 ký tự.')
                return
              }
              setPwError('')
              setStep(1)
            },
            !(username.trim() && email.trim() && password.trim() && confirmPassword.trim()),
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '20px 0',
            }}
          >
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.12)' }} />
            <span
              style={{
                fontSize: 12,
                color: 'rgba(0,0,0,0.40)',
                fontWeight: 600,
              }}
            >
              hoặc
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.12)' }} />
          </div>
          <GoogleButton onClick={handleGoogle} label="Đăng ký với Google" />

          {onLogin && (
            <p
              style={{
                fontSize: 14,
                color: 'rgba(0,0,0,0.60)',
                textAlign: 'center',
                marginTop: 20,
                marginBottom: 0,
              }}
            >
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={onLogin}
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
                Đăng nhập
              </button>
            </p>
          )}
        </>
      )}

      {/* Step 1: OTP */}
      {step === 1 && (
        <>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: 'rgba(0,0,0,0.90)',
              marginBottom: 4,
            }}
          >
            Xác thực OTP
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(0,0,0,0.55)',
              marginBottom: 28,
              lineHeight: 1.6,
            }}
          >
            Chúng tôi đã gửi mã 6 chữ số đến email của bạn. Vui lòng nhập mã để xác thực.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  otpRefs.current[idx] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                style={{
                  width: 46,
                  height: 54,
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: 700,
                  border: `2px solid ${digit ? '#0A66C2' : 'rgba(0,0,0,0.18)'}`,
                  borderRadius: 8,
                  outline: 'none',
                  fontFamily: 'inherit',
                  color: 'rgba(0,0,0,0.90)',
                  transition: 'border-color 150ms',
                }}
                onFocus={(e) => {
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#0A66C2'
                }}
                onBlur={(e) => {
                  if (!digit) {
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.18)'
                  }
                }}
              />
            ))}
          </div>
          {otpError && (
            <p
              style={{
                fontSize: 13,
                color: '#C03A2B',
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              {otpError}
            </p>
          )}
          <p
            style={{
              fontSize: 13,
              color: 'rgba(0,0,0,0.50)',
              textAlign: 'center',
              marginBottom: 4,
            }}
          >
            Không nhận được mã?{' '}
            <span
              style={{ color: '#0A66C2', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setOtp(['', '', '', '', '', ''])}
            >
              Gửi lại
            </span>
          </p>
          {primaryBtn(
            isVerifyingOtp ? 'Đang xác thực...' : 'Xác thực',
            handleVerifyOtp,
            otp.join('').length < 6 || isVerifyingOtp,
          )}
        </>
      )}

      {/* Step 2: School Onboarding */}
      {step === 2 && (
        <>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: 'rgba(0,0,0,0.90)',
              marginBottom: 4,
            }}
          >
            Trường học hiện tại
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(0,0,0,0.55)',
              marginBottom: 22,
            }}
          >
            Chọn hoặc nhập tên trường đại học / trường bạn đang theo học.
          </p>
          <div style={{ marginBottom: 12 }}>
            <input
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
              placeholder="Tìm kiếm trường..."
              style={{ ...inputStyle, marginBottom: 8 }}
              onFocus={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = '#0A66C2'
              }}
              onBlur={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.18)'
              }}
            />
            <div
              style={{
                maxHeight: 220,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {filteredSchools.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSchool(s)
                    setSchoolSearch(s)
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: `1.5px solid ${school === s ? '#0A66C2' : 'rgba(0,0,0,0.10)'}`,
                    background: school === s ? '#EAF1FA' : '#FAFAF8',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: school === s ? '#0A66C2' : 'rgba(0,0,0,0.80)',
                    fontFamily: 'inherit',
                    fontWeight: school === s ? 700 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 150ms',
                  }}
                >
                  <span>{s}</span>
                  {school === s && <CheckFatIcon size={15} color="#0A66C2" weight="fill" />}
                </button>
              ))}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 8,
              gap: 12,
            }}
          >
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinish}
              style={{
                background: 'none',
                border: 'none',
                cursor: isSubmitting ? 'default' : 'pointer',
                fontSize: 14,
                color: 'rgba(0,0,0,0.55)',
                fontFamily: 'inherit',
                fontWeight: 500,
                padding: '10px 0',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  ;(e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.90)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  ;(e.currentTarget as HTMLElement).style.color = 'rgba(0,0,0,0.55)'
                }
              }}
            >
              Bỏ qua
            </button>
            <div style={{ flex: 1 }}>
              {primaryBtn(
                isSubmitting ? 'Đang hoàn tất...' : 'Hoàn tất',
                handleFinish,
                !school || isSubmitting,
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
