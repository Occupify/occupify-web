import { useEffect, useState } from 'react'
import { ArrowRightIcon, WalletIcon, XIcon } from '@phosphor-icons/react'
import { formatVND } from '@/utils'

export interface DepositModalProps {
  balance: number
  onClose: () => void
  onProceedToSepay: (amount: number) => void
}

export function DepositModal({ balance, onClose, onProceedToSepay }: DepositModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const [depositAmount, setDepositAmount] = useState<string>('1000000')
  const [customError, setCustomError] = useState<string | null>(null)

  const quickAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000]
  const numericAmount = parseInt(depositAmount.replace(/\D/g, ''), 10) || 0

  const handleQuickAdd = (val: number) => {
    setDepositAmount(val.toString())
    setCustomError(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '')
    setDepositAmount(rawVal)
    if (customError) setCustomError(null)
  }

  const handleProceed = () => {
    if (numericAmount < 10000) {
      setCustomError('Số tiền nạp tối thiểu là 10.000 ₫')
      return
    }
    onProceedToSepay(numericAmount)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(0,0,0,0.60)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#EAF1FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0A66C2',
              }}
            >
              <WalletIcon size={22} weight="bold" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'rgba(0,0,0,0.90)' }}>
                Nạp tiền vào ví
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>
                Nhập số tiền bạn muốn nạp vào tài khoản
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(0,0,0,0.50)',
              padding: 4,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <XIcon size={20} weight="bold" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Current balance reminder */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 8,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.60)', fontWeight: 500 }}>
              Số dư khả dụng hiện tại:
            </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#0A66C2' }}>
              {formatVND(balance)}
            </span>
          </div>

          {/* Amount input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(0,0,0,0.80)',
                marginBottom: 8,
              }}
            >
              Nhập số tiền muốn nạp <span style={{ color: '#C03A2B' }}>*</span>
            </label>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                value={
                  numericAmount > 0 ? new Intl.NumberFormat('vi-VN').format(numericAmount) : ''
                }
                placeholder="0"
                onChange={handleInputChange}
                autoFocus
                style={{
                  width: '100%',
                  height: 48,
                  padding: '0 40px 0 16px',
                  borderRadius: 8,
                  border: customError ? '2px solid #C03A2B' : '1px solid rgba(0,0,0,0.20)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'rgba(0,0,0,0.90)',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  if (!customError) e.target.style.borderColor = '#0A66C2'
                }}
                onBlur={(e) => {
                  if (!customError) e.target.style.borderColor = 'rgba(0,0,0,0.20)'
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: 16,
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'rgba(0,0,0,0.45)',
                  pointerEvents: 'none',
                }}
              >
                ₫
              </span>
            </div>
            {customError && (
              <div style={{ fontSize: 12, color: '#C03A2B', marginTop: 6, fontWeight: 500 }}>
                {customError}
              </div>
            )}
          </div>

          {/* Quick choices */}
          <div>
            <div
              style={{ fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.60)', marginBottom: 8 }}
            >
              Chọn nhanh số tiền:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {quickAmounts.map((q) => {
                const isSelected = numericAmount === q
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQuickAdd(q)}
                    style={{
                      padding: '9px 8px',
                      borderRadius: 6,
                      border: isSelected ? '1.5px solid #0A66C2' : '1px solid rgba(0,0,0,0.12)',
                      background: isSelected ? '#EAF1FA' : '#fff',
                      color: isSelected ? '#0A66C2' : 'rgba(0,0,0,0.80)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                    }}
                  >
                    +{new Intl.NumberFormat('vi-VN').format(q)}đ
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            background: '#FAFAF9',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.15)',
              background: '#fff',
              fontSize: 14,
              fontWeight: 600,
              color: 'rgba(0,0,0,0.70)',
              cursor: 'pointer',
            }}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleProceed}
            disabled={numericAmount < 10000}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: 'none',
              background: numericAmount >= 10000 ? '#0A66C2' : '#94B4DE',
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              cursor: numericAmount >= 10000 ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: numericAmount >= 10000 ? '0 2px 6px rgba(10,102,194,0.3)' : 'none',
            }}
          >
            Đến trang giao dịch <ArrowRightIcon size={16} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  )
}
