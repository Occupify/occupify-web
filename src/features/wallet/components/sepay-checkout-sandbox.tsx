import { useEffect, useState } from 'react'
import {
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  CopyIcon,
  LockIcon,
  SparkleIcon,
} from '@phosphor-icons/react'
import type { SepayOrder } from '../types'
import { formatVND } from '@/utils'

export interface SepayCheckoutSandboxProps {
  order: SepayOrder
  onSuccess: (amount: number, orderCode: string) => void
  onCancel: () => void
}

export function SepayCheckoutSandbox({ order, onSuccess, onCancel }: SepayCheckoutSandboxProps) {
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedItem(label)
    setTimeout(() => setCopiedItem(null), 1800)
  }

  const handleSimulatePaymentSuccess = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onSuccess(order.amount, order.orderCode)
    }, 700)
  }

  const qrImageUrl = `https://img.vietqr.io/image/MB-0988888888-compact2.png?amount=${order.amount}&addInfo=OPF${order.orderCode}&accountName=CONG%20TY%20CP%20OCCUPIFY`

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0F172A',
        color: '#F8FAFC',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Simulated Browser Address Bar */}
      <div
        style={{
          background: '#1E293B',
          borderBottom: '1px solid rgba(255,255,255,0.10)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#10B981' }} />
        </div>
        <div
          style={{
            flex: 1,
            maxWidth: 680,
            margin: '0 auto',
            background: '#0F172A',
            borderRadius: 6,
            padding: '6px 14px',
            fontSize: 12.5,
            color: '#94A3B8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#E2E8F0',
            }}
          >
            <LockIcon size={13} color="#10B981" weight="bold" />
            https://sandbox.sepay.vn/checkout/order-OPF{order.orderCode}
          </span>
          <span
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#FBBF24',
              fontSize: 10.5,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 4,
              letterSpacing: '0.03em',
            }}
          >
            SEPAY SANDBOX GATEWAY
          </span>
        </div>
      </div>

      {/* Main Sandbox Checkout Canvas */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 16px 48px' }}>
        {/* Gateway Brand Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                width: 44,
                height: 44,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 22,
                color: '#fff',
                letterSpacing: '-0.03em',
                boxShadow: '0 4px 12px rgba(2,132,199,0.35)',
              }}
            >
              S
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    color: '#F8FAFC',
                  }}
                >
                  SePay Checkout
                </h1>
                <span
                  style={{
                    background: '#0369A1',
                    color: '#E0F2FE',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 9999,
                  }}
                >
                  Sandbox Mode
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#94A3B8' }}>
                Cổng thanh toán liên ngân hàng VietQR Napas 24/7 tự động
              </p>
            </div>
          </div>

          <div
            style={{
              background: '#1E293B',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 8,
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ClockIcon size={16} color="#38BDF8" weight="bold" />
            <span style={{ fontSize: 13, color: '#94A3B8' }}>Hết hạn sau:</span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: '#38BDF8',
                fontFamily: 'monospace',
              }}
            >
              {timeFormatted}
            </span>
          </div>
        </div>

        {/* 2-Column Checkout Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20,
            marginBottom: 24,
          }}
        >
          {/* Order info card */}
          <div
            style={{
              background: '#1E293B',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.10)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#38BDF8',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: 12,
                }}
              >
                Thông tin đơn hàng nạp ví
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#F8FAFC',
                  marginBottom: 6,
                }}
              >
                {formatVND(order.amount)}
              </div>
              <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 20 }}>
                Nạp tiền tài khoản Occupify: Nguyễn Minh Khoa
              </div>

              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  paddingTop: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  fontSize: 13,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Mã đơn hàng:</span>
                  <span style={{ fontWeight: 700, color: '#F1F5F9' }}>OPF-{order.orderCode}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Đơn vị thụ hưởng:</span>
                  <span style={{ fontWeight: 600, color: '#F1F5F9' }}>
                    Occupify Platform Vietnam
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Thời gian tạo:</span>
                  <span style={{ color: '#F1F5F9' }}>{order.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Trạng thái:</span>
                  <span
                    style={{
                      color: '#FBBF24',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#FBBF24',
                      }}
                    />
                    Chờ thanh toán
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                background: 'rgba(2,132,199,0.12)',
                border: '1px solid rgba(2,132,199,0.30)',
                borderRadius: 8,
                padding: '14px',
                fontSize: 12.5,
                color: '#BAE6FD',
                lineHeight: 1.45,
              }}
            >
              ℹ️ Đây là trang thanh toán độc lập do <strong>SePay Checkout Sandbox</strong> vận
              hành. Sau khi xác nhận thanh toán, SePay sẽ tự động gửi webhook và cập nhật vào Ví
              Occupify của bạn.
            </div>
          </div>

          {/* VietQR & Transfer Card */}
          <div
            style={{
              background: '#1E293B',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.10)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* VietQR Code Box */}
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: '14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: 240,
                width: '100%',
                marginBottom: 16,
              }}
            >
              <img
                src={qrImageUrl}
                alt="SePay VietQR"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 6,
                  display: 'block',
                }}
                onError={(e) => {
                  ;(e.currentTarget as HTMLElement).style.display = 'none'
                }}
              />
              <div
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#0284C7',
                  textAlign: 'center',
                  letterSpacing: '0.02em',
                }}
              >
                QUÉT MÃ VIETQR QUA APP NGÂN HÀNG
              </div>
            </div>

            {/* Bank details with copy */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {[
                { label: 'Ngân hàng', value: 'MB Bank (Quân Đội)', copyVal: 'MB Bank' },
                { label: 'Số tài khoản', value: '0988 888 888', copyVal: '0988888888' },
                {
                  label: 'Tên tài khoản',
                  value: 'CONG TY CP OCCUPIFY',
                  copyVal: 'CONG TY CP OCCUPIFY',
                },
                {
                  label: 'Số tiền',
                  value: formatVND(order.amount),
                  copyVal: order.amount.toString(),
                },
                {
                  label: 'Nội dung CK',
                  value: `OPF${order.orderCode}`,
                  copyVal: `OPF${order.orderCode}`,
                  highlight: true,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: row.highlight
                      ? 'rgba(245, 158, 11, 0.12)'
                      : 'rgba(255,255,255,0.04)',
                    border: row.highlight
                      ? '1px solid rgba(245, 158, 11, 0.35)'
                      : '1px solid rgba(255,255,255,0.06)',
                    fontSize: 13,
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: '#94A3B8',
                        marginRight: 8,
                        fontSize: 12,
                      }}
                    >
                      {row.label}:
                    </span>
                    <strong style={{ color: row.highlight ? '#FCD34D' : '#F8FAFC' }}>
                      {row.value}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(row.copyVal, row.label)}
                    style={{
                      background: copiedItem === row.label ? '#10B981' : 'rgba(255,255,255,0.12)',
                      border: 'none',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {copiedItem === row.label ? (
                      <>
                        <CheckIcon size={12} weight="bold" /> Đã chép
                      </>
                    ) : (
                      <>
                        <CopyIcon size={12} weight="bold" /> Sao chép
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sandbox Test Action Panel */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            border: '2px dashed #0284C7',
            borderRadius: 12,
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SparkleIcon size={20} color="#38BDF8" weight="fill" />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>
                Bảng điều khiển Sandbox (Testing Sandbox Controls)
              </h3>
              <p style={{ fontSize: 12.5, color: '#94A3B8' }}>
                Vì đây là môi trường sandbox SePay, bạn có thể click nút bên dưới để mô phỏng quét
                mã thanh toán thành công và tự động điều hướng về Occupify với số dư được cộng ngay
                lập tức.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSimulatePaymentSuccess}
              disabled={isProcessing}
              style={{
                flex: 1,
                minWidth: 260,
                padding: '14px 24px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: isProcessing ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
              }}
            >
              {isProcessing ? (
                <>
                  <ArrowsClockwiseIcon size={18} className="animate-spin" /> Đang truyền tín hiệu
                  SePay webhook...
                </>
              ) : (
                <>
                  <CheckCircleIcon size={18} weight="fill" /> Mô phỏng Quét mã & Thanh toán thành
                  công
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '14px 20px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.20)',
                background: 'rgba(255,255,255,0.06)',
                color: '#CBD5E1',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ✕ Hủy giao dịch & Quay về Occupify
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
