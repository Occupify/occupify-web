import { useEffect, useState } from 'react'
import { BankIcon, CheckCircleIcon, XIcon } from '@phosphor-icons/react'
import { MOCK_VIETNAM_BANKS } from '../api'
import { formatVND } from '@/utils'

export interface WithdrawModalProps {
  balance: number
  onClose: () => void
  onConfirmWithdraw: (
    bank: string,
    accountNumber: string,
    amount: number,
    accountName: string,
  ) => void
}

export function WithdrawModal({ balance, onClose, onConfirmWithdraw }: WithdrawModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const [selectedBank, setSelectedBank] = useState(MOCK_VIETNAM_BANKS[0].shortName)
  const [accountNumber, setAccountNumber] = useState('1029384756')
  const [accountName] = useState('NGUYEN MINH KHOA')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('5000000')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const numericAmount = parseInt(withdrawAmount.replace(/\D/g, ''), 10) || 0

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '')
    setWithdrawAmount(rawVal)
    if (errorMsg) setErrorMsg(null)
  }

  const handleWithdrawAll = () => {
    setWithdrawAmount(balance.toString())
    if (errorMsg) setErrorMsg(null)
  }

  const handleSubmit = () => {
    if (!accountNumber.trim()) {
      setErrorMsg('Vui lòng nhập số tài khoản ngân hàng')
      return
    }
    if (numericAmount < 50000) {
      setErrorMsg('Số tiền rút tối thiểu là 50.000 ₫')
      return
    }
    if (numericAmount > balance) {
      setErrorMsg(`Số tiền rút vượt quá số dư khả dụng (${formatVND(balance)})`)
      return
    }
    onConfirmWithdraw(selectedBank, accountNumber.trim(), numericAmount, accountName)
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
          maxWidth: 500,
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
                background: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C03A2B',
              }}
            >
              <BankIcon size={22} weight="bold" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'rgba(0,0,0,0.90)' }}>
                Rút tiền về tài khoản ngân hàng
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>
                Chuyển khoản liên ngân hàng 24/7 tức thì
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
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Balance card */}
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
              Số dư khả dụng để rút:
            </span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#137333' }}>
              {formatVND(balance)}
            </span>
          </div>

          {/* Bank selector */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(0,0,0,0.80)',
                marginBottom: 6,
              }}
            >
              Chọn ngân hàng nhận tiền <span style={{ color: '#C03A2B' }}>*</span>
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              style={{
                width: '100%',
                height: 44,
                padding: '0 14px',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.20)',
                fontSize: 14,
                fontWeight: 600,
                color: 'rgba(0,0,0,0.90)',
                background: '#fff',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {MOCK_VIETNAM_BANKS.map((b) => (
                <option key={b.code} value={b.shortName}>
                  [{b.code}] {b.shortName} - {b.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Account number */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(0,0,0,0.80)',
                marginBottom: 6,
              }}
            >
              Số tài khoản thụ hưởng <span style={{ color: '#C03A2B' }}>*</span>
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value)
                if (errorMsg) setErrorMsg(null)
              }}
              placeholder="Nhập số tài khoản ngân hàng"
              style={{
                width: '100%',
                height: 44,
                padding: '0 14px',
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.20)',
                fontSize: 15,
                fontWeight: 600,
                color: 'rgba(0,0,0,0.90)',
                outline: 'none',
              }}
            />
            <div
              style={{
                fontSize: 12,
                color: 'rgba(0,0,0,0.55)',
                marginTop: 5,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <CheckCircleIcon size={13} color="#137333" weight="fill" />
              Tên người thụ hưởng:{' '}
              <strong style={{ color: 'rgba(0,0,0,0.85)' }}>{accountName}</strong>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'rgba(0,0,0,0.80)',
                }}
              >
                Số tiền muốn rút <span style={{ color: '#C03A2B' }}>*</span>
              </label>
              <button
                type="button"
                onClick={handleWithdrawAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0A66C2',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Rút toàn bộ
              </button>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={
                  numericAmount > 0 ? new Intl.NumberFormat('vi-VN').format(numericAmount) : ''
                }
                placeholder="0"
                onChange={handleAmountChange}
                style={{
                  width: '100%',
                  height: 46,
                  padding: '0 40px 0 14px',
                  borderRadius: 8,
                  border: errorMsg ? '2px solid #C03A2B' : '1px solid rgba(0,0,0,0.20)',
                  fontSize: 17,
                  fontWeight: 700,
                  color: 'rgba(0,0,0,0.90)',
                  outline: 'none',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: 14,
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'rgba(0,0,0,0.45)',
                  pointerEvents: 'none',
                }}
              >
                ₫
              </span>
            </div>
            {errorMsg && (
              <div
                style={{
                  fontSize: 12,
                  color: '#C03A2B',
                  marginTop: 6,
                  fontWeight: 500,
                }}
              >
                {errorMsg}
              </div>
            )}
          </div>

          {/* Summary */}
          <div
            style={{
              background: '#FAFAF9',
              border: '1px dashed rgba(0,0,0,0.12)',
              borderRadius: 8,
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontSize: 12.5,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'rgba(0,0,0,0.60)',
              }}
            >
              <span>Phí giao dịch:</span>
              <span style={{ color: '#137333', fontWeight: 700 }}>Miễn phí (0 ₫)</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'rgba(0,0,0,0.60)',
              }}
            >
              <span>Thời gian xử lý:</span>
              <span>Khoảng 5 - 15 phút</span>
            </div>
            <div
              style={{
                borderTop: '1px solid rgba(0,0,0,0.06)',
                paddingTop: 6,
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 700,
                color: 'rgba(0,0,0,0.90)',
                fontSize: 13.5,
              }}
            >
              <span>Số tiền thực nhận:</span>
              <span style={{ color: '#C03A2B' }}>{formatVND(numericAmount)}</span>
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
            onClick={handleSubmit}
            disabled={numericAmount <= 0 || numericAmount > balance}
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: 'none',
              background: numericAmount > 0 && numericAmount <= balance ? '#0A66C2' : '#94B4DE',
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              cursor: numericAmount > 0 && numericAmount <= balance ? 'pointer' : 'not-allowed',
              boxShadow:
                numericAmount > 0 && numericAmount <= balance
                  ? '0 2px 6px rgba(10,102,194,0.3)'
                  : 'none',
            }}
          >
            Xác nhận Rút tiền
          </button>
        </div>
      </div>
    </div>
  )
}
