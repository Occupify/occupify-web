import * as React from 'react'
import { CheckFatIcon } from '@phosphor-icons/react'
import { AuthInput } from './auth-input'
import { GoogleButton } from './google-button'
import { StepIndicator } from './step-indicator'
import { MOCK_SCHOOL_OPTIONS } from '../api'
import { useRegister, useVerifyOtp, useResendOtp, useGoogleLogin } from '../hooks'
import { getAuthErrorMessage } from '../utils'

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
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [registerError, setRegisterError] = React.useState('')

  // Step 1: OTP
  const [otp, setOtp] = React.useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = React.useState('')
  const [resendCooldown, setResendCooldown] = React.useState(0)
  const [resendSuccess, setResendSuccess] = React.useState('')
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([])

  // Step 2: school
  const [school, setSchool] = React.useState('')
  const [schoolSearch, setSchoolSearch] = React.useState('')

  const TOTAL_STEPS = 3

  const registerMutation = useRegister()
  const verifyOtpMutation = useVerifyOtp()
  const resendOtpMutation = useResendOtp()
  const googleLoginMutation = useGoogleLogin()

  // Cooldown countdown timer for resend OTP
  React.useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  // Step 0: Submit Registration
  const handleRegisterSubmit = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault()
    setRegisterError('')

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setRegisterError('Vui lòng điền đầy đủ thông tin.')
      return
    }

    if (password.length < 8) {
      setRegisterError('Mật khẩu phải có ít nhất 8 ký tự.')
      return
    }

    if (password !== confirmPassword) {
      setRegisterError('Mật khẩu và xác nhận mật khẩu không khớp.')
      return
    }

    try {
      await registerMutation.mutateAsync({
        email: email.trim(),
        password,
      })
      setStep(1)
      setResendCooldown(60)
    } catch (err: unknown) {
      setRegisterError(getAuthErrorMessage(err, 'Đăng ký không thành công.'))
    }
  }

  // Step 1: Verify OTP
  const handleVerifyOtp = async () => {
    const code = otp.join('')
    if (code.length < 6) {
      setOtpError('Vui lòng nhập đủ 6 chữ số.')
      return
    }

    try {
      setOtpError('')
      await verifyOtpMutation.mutateAsync({
        email: email.trim(),
        otpCode: code,
        type: 'REGISTER',
      })
      setStep(2)
    } catch (err: unknown) {
      setOtpError(getAuthErrorMessage(err, 'Xác thực OTP không thành công.'))
    }
  }

  // Step 1: Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendOtpMutation.isPending) return

    try {
      setOtpError('')
      setResendSuccess('')
      await resendOtpMutation.mutateAsync({
        email: email.trim(),
        type: 'REGISTER',
      })
      setResendCooldown(60)
      setResendSuccess('Đã gửi lại mã OTP vào hòm thư của bạn.')
      setOtp(['', '', '', '', '', ''])
    } catch (err: unknown) {
      setOtpError(getAuthErrorMessage(err, 'Lỗi gửi lại mã OTP.'))
    }
  }

  // Step 2: Finish onboarding
  const handleFinish = React.useCallback(() => {
    if (onSuccess) {
      onSuccess()
    }
  }, [onSuccess])

  const handleGoogle = React.useCallback(async () => {
    try {
      await googleLoginMutation.mutateAsync()
      if (onGoogle) {
        onGoogle()
      } else if (onSuccess) {
        onSuccess()
      }
    } catch (err: unknown) {
      setRegisterError(getAuthErrorMessage(err, 'Đăng ký bằng Google không thành công.'))
    }
  }, [googleLoginMutation, onGoogle, onSuccess])

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

          {registerError && (
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
              {registerError}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit}>
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

            {primaryBtn(
              registerMutation.isPending ? 'Đang tạo tài khoản...' : 'Tiếp tục',
              () => handleRegisterSubmit(),
              !(email.trim() && password.trim() && confirmPassword.trim()) ||
                registerMutation.isPending,
            )}
          </form>

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
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            Mã OTP 6 chữ số đã được gửi đến email <strong>{email}</strong>. Vui lòng kiểm tra hòm
            thư của bạn.
          </p>

          {resendSuccess && (
            <div
              style={{
                background: '#F0FDF4',
                border: '1px solid #86EFAC',
                borderRadius: 8,
                padding: '8px 12px',
                color: '#166534',
                fontSize: 13,
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              {resendSuccess}
            </div>
          )}

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
              marginBottom: 16,
            }}
          >
            Không nhận được mã?{' '}
            {resendCooldown > 0 ? (
              <span style={{ color: '#64748B', fontWeight: 600 }}>
                Gửi lại sau ({resendCooldown}s)
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendOtpMutation.isPending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0A66C2',
                  cursor: 'pointer',
                  fontWeight: 600,
                  padding: 0,
                  fontSize: 13,
                  fontFamily: 'inherit',
                }}
              >
                {resendOtpMutation.isPending ? 'Đang gửi...' : 'Gửi lại mã OTP'}
              </button>
            )}
          </p>

          {primaryBtn(
            verifyOtpMutation.isPending ? 'Đang xác thực...' : 'Xác thực tài khoản',
            handleVerifyOtp,
            otp.join('').length < 6 || verifyOtpMutation.isPending,
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
              marginBottom: 20,
            }}
          >
            Chọn trường học của bạn để tối ưu hồ sơ việc làm.
          </p>

          <input
            type="text"
            placeholder="Tìm kiếm trường học..."
            value={schoolSearch}
            onChange={(e) => setSchoolSearch(e.target.value)}
            style={{ ...inputStyle, marginBottom: 12 }}
          />

          <div
            style={{
              maxHeight: 180,
              overflowY: 'auto',
              border: '1px solid rgba(0,0,0,0.10)',
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            {filteredSchools.map((s) => (
              <div
                key={s}
                onClick={() => setSchool(s)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  background: school === s ? 'rgba(10,102,194,0.08)' : 'transparent',
                  color: school === s ? '#0A66C2' : 'rgba(0,0,0,0.85)',
                  fontWeight: school === s ? 600 : 400,
                  fontSize: 13.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <span>{s}</span>
                {school === s && <CheckFatIcon size={16} weight="fill" color="#0A66C2" />}
              </div>
            ))}
          </div>

          {primaryBtn('Hoàn tất và Đăng nhập', handleFinish, false)}
        </>
      )}
    </div>
  )
}
